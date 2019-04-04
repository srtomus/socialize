const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_proyecto_2daw_vlad_every_meeting_meanstack';

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La petición no tiene la cabecera de autenticación' })
    }

    var token = req.headers.authorization.replace(/['"']+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'El token ha expirado'});
        }

    } catch (err) {
        return res.status(404).send({ message: 'El token no es válido'});
    }

    next();
}