const Group = require('../models/groups.schema');
const User = require('../models/users.schema');
const Follow = require('../models/follows.schema');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

function saveGroup(req, res) {
    var params = req.body;

    if (!params.description) return res.status(200).send({
        message: "Debes enviar un texto!!"
    });

    var group = new Group();
    group.description = params.description;
    group.name = params.name;
    group.author = req.user.sub;
    group.nr_members = params.nr_members;
    group.members = 0;
    group.category = params.category;
    group.created_at = moment().unix();
    group.date_at = params.date_at;
    group.hour = params.hour;
    group.lat = params.lat;
    group.lng = params.lng;

    group.save((err, groupStored) => {
        if (err) return res.status(500).send({
            message: 'Error al guardar el grupo'
        });

        if (!groupStored) return res.status(404).send({
            message: 'El grupo no se ha guardado'
        });

        return res.status(200).send({
            group: groupStored
        });
    })
}

function getGroups(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 3;

    Follow.find({
        user: req.user.sub
    }).populate('followed').exec((err, follows) => {
        if (err) return res.status(500).send({
            message: 'Error al devolver el seguimiento'
        });

        var follows_clean = [];

        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        follows_clean.push(req.user.sub);

        Group.find({
            author: {
                "$in": follows_clean
            }
        }).sort('-created_at').populate('author').paginate(page, itemsPerPage, (err, groups, total) => {
            if (err) return res.status(500).send({
                message: 'Error al devolver el grupo'
            });

            if (!groups) return res.status(404).send({
                message: 'No hay grupos'
            });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                groups
            })
        });
    });
}

function getGroup(req, res) {
    var groupId = req.params.id;

    Group.findById(groupId).populate('author').exec((err, group) => {
        if (err) return res.status(500).send({
            message: 'Error al devolver el grupo'
        });

        if (!group) return res.status(404).send({
            message: 'No existe el grupo'
        });

        return res.status(200).send({
            group
        });
    })
}

function getAllGroups(req, res) {
    var groupId = req.params.id;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 9;

    Group.find(groupId).sort('-created_at').populate("author").paginate(page, itemsPerPage, (err, groups, total) => {
        if (err) return res.status(500).send({
            message: 'Error al devolver el grupo'
        });

        if (!groups) return res.status(404).send({
            message: 'No existe el grupo'
        });

        return res.status(200).send({
            groups,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    })
}

function getThreeItems(req, res) {
    var groupId = req.params.id;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 3;

    Group.find(groupId).sort('-created_at').populate("author").paginate(page, itemsPerPage, (err, groups, total) => {
        if (err) return res.status(500).send({
            message: 'Error al devolver el grupo'
        });

        if (!groups) return res.status(404).send({
            message: 'No existe el grupo'
        });

        return res.status(200).send({
            groups
        });
    })
}

function deleteGroup(req, res) {
    var groupId = req.params.id;

    Group.find({
        '_id': groupId
    }).remove(err => {
        if (err) return res.status(500).send({
            message: 'Error al borrar el grupo'
        });

        return res.status(200).send({
            message: "Grupo eliminado"
        });
    })
}

function groupImage(req, res) {
    var grouId = req.params.id;

    if (req.files) {

        var file_path = req.files.null.path;

        var file_split = file_path.split('\\');

        var file_name = file_split[2];

        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Group.findOne({
                'user': req.user.sub,
                '_id': groupId
            }).exec((err, group) => {
                if (group) {
                    Group.findByIdAndUpdate(grouId, {
                        image: file_name
                    }, {
                        new: true
                    }, (err, groupUpdated) => {
                        if (err) return res.status(500).send({
                            message: 'Error en la petición'
                        });

                        if (!groupUpdated) return res.status(404).send({
                            message: 'No se ha podido actualizar el grupo'
                        });

                        return res.status(200).send({
                            group: groupUpdated
                        });
                    })
                } else {
                    return removeFilesOfUploads(res, file_path, 'No tienes permiso para subir la foto');
                }
            })
        } else {
            return removeFilesOfUploads(res, file_path, 'Extensión no válida');
        }
    } else {
        return res.status(200).send({
            message: 'No se han subido imagenes'
        });
    }
}

function updateGroup(req, res) {
    var groupId = req.params.id;
    var update = req.body;

    Group.findByIdAndUpdate(groupId, update, {
        new: true
    }, (err, groupUpdated) => {
        if (err) return res.status(500).send({
            message: 'Error en la petición'
        });

        if (!groupUpdated) return res.status(404).send({
            message: 'No se ha podido actualizar el usuario'
        });

        return res.status(200).send({
            group: groupUpdated
        });
    })
}

function getGroupImg(req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/groups/' + imageFile;

    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(200).send({
                message: 'No existe la imagen...'
            });
        }
    });
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({
            message: message
        });
    })
}

module.exports = {
    saveGroup,
    getGroups,
    getGroup,
    deleteGroup,
    groupImage,
    getGroupImg,
    getAllGroups,
    getThreeItems,
    updateGroup
}