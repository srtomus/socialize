const User = require('../models/users.schema');
const Follow = require('../models/follows.schema');
const Group = require('../models/groups.schema');
const GroupFollow = require('../models/groupFollows.schema');
const Publication = require('../models/publications.schema');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

function prueba(req, res) {
    var params = req.body;
    return res.status(200).send({
        params: params
    });
}

// Registro
function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.nickname &&
        params.email && params.password) {

        user.name = params.name;
        user.lastname = params.lastname;
        user.description = params.description;
        user.nickname = params.nickname;
        user.email = params.email;
        user.age = params.age;
        user.gender = params.gender;
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
                        if (err) return res.status(500).send({
                            message: "Error al guardar el usuario"
                        });

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

        followThisUser(req.user.sub, userId).then((value) => {
            return res.status(200).send({
                user,
                value
            });
        });
    });
}

async function followThisUser(identity_user_id, user_id) {
    try {
        var following = await Follow.findOne({
                user: identity_user_id,
                followed: user_id
            }).exec()
            .then((following) => {
                return following;
            })
            .catch((err) => {
                return handleerror(err);
            });
        var followed = await Follow.findOne({
                user: user_id,
                followed: identity_user_id
            }).exec()
            .then((followed) => {
                return followed;
            })
            .catch((err) => {
                return handleerror(err);
            });
        return {
            following: following,
            followed: followed
        }
    } catch (e) {
        console.log(e);
    }
}

// Devolver listado de usuarios
function getUsers(req, res) {
    var identity_user_id = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 12;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({
            message: "Error en la petición"
        });

        if (!users) return res.status(404).send({
            message: "No hay usuarios disponibles"
        });

        followUserIds(identity_user_id).then((value) => {
            return res.status(200).send({
                users,
                users_following: value.following,
                users_follow_me: value.followed,
                total,
                pages: Math.ceil(total / itemsPerPage)
            });
        });
    })
}

async function followUserIds(user_id) {
    var following = await Follow.find({
        "user": user_id
    }).select({
        '_id': 0,
        '__uv': 0,
        'user': 0
    }).exec().then((follows) => {

        var follows_clean = [];

        follows.forEach((follow) => {

            follows_clean.push(follow.followed);

        });

        return follows_clean;

    }).catch((err) => {

        return handleerror(err);

    });


    var followed = await Follow.find({
        "followed": user_id
    }).select({
        '_id': 0,
        '__uv': 0,
        'followed': 0
    }).exec().then((follows) => {

        var follows_clean = [];

        follows.forEach((follow) => {

            follows_clean.push(follow.user);

        });

        return follows_clean;

    }).catch((err) => {

        return handleerror(err);

    });

    return {

        following: following,

        followed: followed

    }

}

function getCounters(req, res) {
    var userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }

    getCountFollow(userId).then((value) => {
        return res.status(200).send(value);
    });

}

async function getCountFollow(user_id) {
    var following = await Follow.countDocuments({
            user: user_id
        })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => {
            return handleError(err);
        });

    var followed = await Follow.countDocuments({
            followed: user_id
        })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => {
            return handleError(err);
        });

    var groups = await GroupFollow.countDocuments({
            user: user_id
        })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => {
            return handleError(err);
        });

    var publications = await Publication.countDocuments({
            user: user_id
        })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => {
            return handleError(err);
        });

    return {
        following: following,
        followed: followed,
        group: groups,
        publication: publications
    }

}

// Actualizar datos de un usuario
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (!update.password) {
        delete update.password;
    }

    if (userId != req.user.sub && req.params.role == "ROLE_USER") {
        return res.status(500).send({
            message: 'No tienes permiso para actualizar los datos del usuario'
        });
    }

    bcrypt.hash(update.password, null, null, (err, hash) => {
        update.password = hash

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
    })
}

function deleteUser(req, res) {
    var userId = req.params.id;

    User.find({
        '_id': userId
    }).remove(err => {
        if (err) return res.status(500).send({
            message: 'Error al borrar el usuario (User)'
        });

        Publication.find({
            user: userId
        }).remove(err => {
            if (err) return res.status(500).send({
                message: 'Error al borrar el usuario (Publication)'
            });

            Group.find({
                author: userId
            }).remove(err => {
                if (err) return res.status(500).send({
                    message: 'Error al borrar el usuario (Group)'
                });

                Follow.find({
                    followed: userId
                }).remove(err => {
                    if (err) return res.status(500).send({
                        message: 'Error al borrar el usuario (Follow)'
                    });

                    return res.status(200).send({
                        message: "Usuario eliminado"
                    });
                })
            })
        })
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

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' || file_ext == 'JPG' || file_ext == 'PNG' || file_ext == 'JPEG') {
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

function getUserImg(req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/' + imageFile;

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

function updateInterests(req, res) {
    var userId = req.params.id;
    var update = req.body;

    delete update.password;

    if (userId != req.user.sub && req.params.role == "ROLE_USER") {
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

module.exports = {
    prueba,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getUserImg,
    getCounters,
    deleteUser,
    updateInterests
}