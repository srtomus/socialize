const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');

const User = require('../models/users.schema');
const Group = require('../models/groups.schema');
const GroupFollow = require('../models/groupFollows.schema');

function groupFollow(req, res) {
    var params = req.body;
    
    var groupFollow = new GroupFollow();
    groupFollow.user = req.user.sub;
    groupFollow.grfollowed = params.grfollowed;

    groupFollow.save((err, followStored) => {
        if(err) return res.status(500).send({message: 'Error al guardar el seguimiento'});

        if(!followStored) return res.status(404).send({message: 'El seguimiento no se ha guardado'});

        return res.status(200).send({follow: followStored});
    })
}

function groupUnfollow(req, res) {
    var followId = req.params.id;
    var userId = req.user.sub;

    GroupFollow.find({'user': userId, 'grfollowed': followId}).remove(err=> {
        if(err) return res.status(500).send({message: 'Error al guardar el seguimiento'});

        return res.status(200).send({message: 'El follow se ha eliminado'})
    })
}

function getFollowingGroups(req, res) {
    var userId = req.user.sub;
    
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    GroupFollow.find({user: userId}).populate({path: 'grfollowed'}).paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message: 'Error al en el servidor'});

        if (!follows) return res.status(404).send({message: 'No hay follows'});
    
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        })
    })
}

function getFollowedGroups(req, res) {
    var userId = req.params.id;
    
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    GroupFollow.find({grfollowed: userId}).populate('author').paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message: 'Error al en el servidor'});

        if (!follows) return res.status(404).send({message: 'No te sigue ningún usuario'});
    
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        })
    })
}

function getMyGroupFollows(req, res) {
    var userId = req.user.sub;

    GroupFollow.find({user: userId}).exec((err, follows) => {
        if(err) return res.status(500).send({message: 'Error en el servidor'});

        if(!follows) return res.status(404).send({message: 'No sigues ningún grupo'});

        return res.status(200).send({follows});
    });
}

function getMyGroupFollowsProfile(req, res) {
    var userId = req.params.id;

    var find = GroupFollow.find({user: userId});

    if (req.params.followed) {
        find = GroupFollow.find({grfollowed: userId});
    }

    find.populate('user grfollowed').exec((err, follows) => {
        if(err) return res.status(500).send({message: 'Error en el servidor'});

        if(!follows) return res.status(404).send({message: 'No sigues ningún usuario'});

        return res.status(200).send({follows});
    });
}

module.exports = {
    groupFollow,
    groupUnfollow,
    getFollowingGroups,
    getFollowedGroups,
    getMyGroupFollows,
    getMyGroupFollowsProfile
}