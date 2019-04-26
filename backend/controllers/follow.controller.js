const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');

const User = require('../models/users.schema');
const Follow = require('../models/follows.schema');

function saveFollow(req, res) {
    var params = req.body;
    
    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if(err) return res.status(500).send({message: 'Error al guardar el seguimiento'});

        if(!followStored) return res.status(404).send({message: 'El seguimiento no se ha guardado'});

        return res.status(200).send({follow: followStored});
    })
}

function unFollow(req, res) {
    var followId = req.params.id;
    var userId = req.user.sub;

    Follow.find({'user': userId, 'followed': followId}).remove(err=> {
        if(err) return res.status(500).send({message: 'Error al guardar el seguimiento'});

        return res.status(200).send({message: 'El follow se ha eliminado'})
    })
}

function getFollowingUsers(req, res) {
    var userId = req.user.sub;
    
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message: 'Error al en el servidor'});

        if (!follows) return res.status(404).send({message: 'No hay follows'});
    
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        })
    })
}

function getFollowedUsers(req, res) {
    var userId = req.user.sub;
    
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message: 'Error al en el servidor'});

        if (!follows) return res.status(404).send({message: 'No te sigue ningún usuario'});
    
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        })
    })
}

// Devolver listado de usuarios
function getMyFollows(req, res) {
    var userId = req.user.sub;

    var find = Follow.find({user: userId});
    if (req.params.followed) {
        find = Follow.find({followed: userId});
    }

    find.populate('user followed').exec((err, follows) => {
        if(err) return res.status(500).send({message: 'Error en el servidor'});

        if(!follows) return res.status(404).send({message: 'No sigues ningún usuario'});

        return res.status(200).send({follows});
    });
}

module.exports = {
    saveFollow,
    unFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}