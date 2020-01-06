const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();
var jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                accion: 'Login de usuario',
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                accion: 'Login de usuario',
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                accion: 'Login de usuario',
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            accion: 'Login de usuario',
            usuario: usuarioDB,
            token
        });
    });

});


// configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                action: 'login de usuario con una cuenta de google',
                err: e
            });
        });
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                accion: 'Login de usuario con cuenta de google',
                err
            });
        }
        if (usuarioDB) {
            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    accion: 'Login de usuario con cuenta de google',
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    accion: 'Login de usuario con cuenta de google',
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //usuario de google no existe en la BD
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;
            usuario.password = ':)';
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        accion: 'Error en la creación de usuario de goolge',
                        err
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    accion: 'Login de nuevo usuario con cuenta de google',
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
});



module.exports = app