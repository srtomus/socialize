const Publication = require('../models/publications.schema');
const User = require('../models/users.schema');
const Follow = require('../models/follows.schema');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

function savePublication(req, res) {
    var params = req.body;

    if (!params.text) return res.status(200).send({
        message: "Debes enviar un texto!!"
    });

    var publication = new Publication();
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({
            message: 'Error al guardar la publicación'
        });

        if (!publicationStored) return res.status(404).send({
            message: 'La publicación no se ha guardado'
        });

        return res.status(200).send({
            publication: publicationStored
        });
    })
}

function getPublications(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

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

        Publication.find({
            user: {
                "$in": follows_clean
            }
        }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) return res.status(500).send({
                message: 'Error en la publicación del grupo'
            });

            if (!publications) return res.status(404).send({
                message: 'No hay publicaciones'
            });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        });
    });
}

function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({
            message: 'Error al devolver la publicación'
        });

        if (!publication) return res.status(404).send({
            message: 'No existe la publicación'
        });

        return res.status(200).send({
            publication
        });
    })
}

function getPublicationsUser(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    var user_id = req.user.sub;
    if(req.params.user_id) {
        user_id = req.params.user_id;
    }

    Publication.find({
        user: user_id
    }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
        if (err) return res.status(500).send({
            message: 'Error en la publicación del grupo'
        });

        if (!publications) return res.status(404).send({
            message: 'No hay grupos'
        });

        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            items_per_page: itemsPerPage,
            publications
        })
    });
}

function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({
            message: 'Error al devolver la publicación'
        });

        if (!publication) return res.status(404).send({
            message: 'No existe la publicación'
        });

        return res.status(200).send({
            publication
        });
    })
}

function deletePublication(req, res) {
    var publicationId = req.params.id;

    Publication.find({
        'user': req.user.sub,
        '_id': publicationId
    }).remove(err => {
        if (err) return res.status(500).send({
            message: 'Error al borrar la publicación'
        });

        return res.status(200).send({
            message: "Publicación eliminada"
        });
    })
}

function publicationImage(req, res) {
    var publicationId = req.params.id;

    if (req.files) {

        var file_path = req.files.null.path;

        var file_split = file_path.split('\\');

        var file_name = file_split[2];

        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Publication.findOne({
                'user': req.user.sub,
                '_id': publicationId
            }).exec((err, publication) => {
                if (publication) {
                    Publication.findByIdAndUpdate(publicationId, {
                        image: file_name
                    }, {
                        new: true
                    }, (err, publicationUpdated) => {
                        if (err) return res.status(500).send({
                            message: 'Error en la petición'
                        });

                        if (!publicationUpdated) return res.status(404).send({
                            message: 'No se ha podido actualizar la publicación'
                        });

                        return res.status(200).send({
                            publication: publicationUpdated
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

function getPublicationImg(req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/publications/' + imageFile;

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
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    publicationImage,
    getPublicationImg,
    getPublicationsUser
}