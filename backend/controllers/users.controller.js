const User = require('../models/users.schema');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

// Funciones de prueba
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

// Registro
function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.nickname &&
        params.email && params.password) {

        user.name = params.name;
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
                    nickname: user.nickname.toLowerCase()
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

// Login
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
                    if (params.gettoken) {
                        // Generar y devolver el token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    } else {
                        // Devolver datos del usuario
                        user.password = undefined;
                        return res.status(200).send({
                            user
                        });
                    }
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

// Obtener un usuario
function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({
            message: "Error en la petición"
        });

        if (!user) return res.status(404).send({
            message: "El usuario no existe"
        });

        return res.status(200).send({
            user
        });
    })
}

// Devolver listado de usuarios
function getUsers(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({
            message: "Error en la petición"
        });

        if (!users) return res.status(404).send({
            message: "No hay usuarios disponibles"
        });

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total / itemsPerPage)
        })
    })
}

// Actualizar datos de un usuario
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    // Borrar propiedad password
    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({
            message: 'No tienes permiso para actualizar los datos del usuario'
        });
    }

    User.findByIdAndUpdate(userId, update, {
        new: true
    }, (err, userUpdated) => {
        if (err) return res.status(500).send({
            message: 'Error en la petición'
        });

        if (!userUpdated) return res.status(404).send({
            message: 'No se ha podido actualizar el usuario'
        });

        return res.status(200).send({
            user: userUpdated
        });
    })
}

// Subir foto de perfil
function uploadImage(req, res) {
    var userId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;

        var file_split = file_path.split('\\');

        var file_name = file_split[2];

        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];

        if (userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
        }

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, {
                image: file_name
            }, {
                new: true
            }, (err, userUpdated) => {
                if (err) return res.status(500).send({
                    message: 'Error en la petición'
                });

                if (!userUpdated) return res.status(404).send({
                    message: 'No se ha podido actualizar el usuario'
                });

                return res.status(200).send({
                    user: userUpdated
                });
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

function getUserImg (req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/' + imageFile;

    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(200).send({message: 'No existe la imagen...'});
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
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getUserImg
}