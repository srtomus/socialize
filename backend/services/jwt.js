const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_proyecto_2daw_vlad_every_meeting_meanstack';

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add('30', 'days').unix()
    };

    return jwt.encode(payload, secret);
}