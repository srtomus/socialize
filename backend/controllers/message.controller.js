const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');
const moment = require('moment');

const User = require('../models/users.schema');
const Follow = require('../models/follows.schema');
const Message = require('../models/message.schema');

function saveMessage(req, res) {
    var params = req.body;

    if (!params.text || !params.receiver) return res.status(200).send({
        message: "Envía los datos necesarios"
    })

    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err, messageStored) => {
        if (err) return res.status(500).send({
            message: "Error en la petición"
        })
        if (!messageStored) return res.status(500).send({
            message: "Error al enviar el mensaje"
        })

        return res.status(200).send({
            message: messageStored
        });
    })
}

function getReceivedMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({
        receiver: userId
    }).sort('-created_at').populate({path: "emitter"}).paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({
            message: "Error en la petición"
        })
        if (!messages) return res.status(404).send({
            message: "No hay mensajes"
        })

        return res.status(200).send({
            itemsPerPage: itemsPerPage,
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        })
    })
}

function getSentMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({
        emitter: userId
    }).populate({path: "receiver"}).paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) {
            return res.status(500).send({
                message: "Error en la petición"
            })
        }

        if (!messages) {
            return res.status(404).send({
                message: "No hay mensajes"
            })
        }

        return res.status(200).send({
            itemsPerPage: itemsPerPage,
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        })


    })
}

function getUnviewedMessages(req, res) {
    var userId = req.user.sub;

    Message.count({
        receiver: userId,
        viewed: 'false'
    }).exec((err, messages) => {
        if (err) return res.status(500).send({
            message: "Error en la petición"
        })

        return res.status(200).send({
            'unviewed': count
        })
    })
}

function setViewedMessages(req, res) {
    var userId = req.user.sub;

    Message.update({
        receiver: userId,
        viewed: 'false'
    }, {
        viewed: 'true'
    }, {
        "multi": true
    }, (err, messageUpdated) => {
        if (err) return res.status(500).send({
            message: "Error en la petición"
        })

        return res.status(200).send({
            messages: messageUpdated
        })
    })
}

module.exports = {
    saveMessage,
    getReceivedMessages,
    getSentMessages,
    getUnviewedMessages,
    setViewedMessages
}