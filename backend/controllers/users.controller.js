const User = require('../models/users.schema');
const bcrypt = require('bcrypt-nodejs')

function home(req, res) {
    res.status(200).send({
        message: 'Hola mundo home'
    })
}

function pruebas(req, res) {
    res.status(200).send({
        message: 'Hola mundo pruebas'
    })
}

function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.surname && params.nickname &&
        params.email && params.password) {

        user.name = params.name;
        user.surname = params.surname;
        user.nickname = params.nickname;
        user.email = params.email;
        user.password = params.password;
        user.role = 'ROLE_USER';
        user.image = null;

        // Comprobar usuarios duplicados
        User.find({
            $or: [{
                    email: user.email.toLowerCase()
                },
                {
                    nick: user.nickname.toLowerCase()
                }
            ]
        }).exec((err, users) => {
            if (err) {
                return res.status(500).send({
                    message: 'Error en la petición de usuarios'
                })
            }

            if (users && users.length >= 1) {
                return res.status(200).send({
                    message: 'El usuario que intentas registrar ya existe'
                })
            } else {

                // Cifra la password y guarda los datos
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if (err) {
                            return res.status(500).send({
                                message: "Error al guardar el usuario"
                            });
                        }

                        if (userStored) {
                            res.status(200).send({
                                user: userStored
                            });
                        } else {
                            res.status(404).send({
                                message: "No se ha registrado el usuario"
                            });
                        }
                    })
                })
            }
        })

    } else {
        res.status(200).send({
            message: "Envía todos los campos necesarios"
        })
    }
}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({
        email: email
    }, (err, user) => {
        if (err) {
            return res.status(500).send({
                message: "Error en la petición"
            })
        }

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    return res.status(200).send({
                        user
                    })
                } else {
                    return res.status(404).send({
                        message: "El usuario no se ha podido identificar"
                    })
                }
            })
        } else {
            return res.status(404).send({
                message: "El usuario no se ha podido identificar!!"
            })
        }
    })
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser
}