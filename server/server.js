require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded. Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json. Middleware
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    res.json('get página inicio');
});
app.get('/usuario', function(req, res) {
    res.json('get usuario');
});
app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {
        res.json({
            persona: body
        });
    }

});
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id: id,
        nombre: 'marcelo'
    });
});
app.delete('/usuario', function(req, res) {
    res.json('delete usuario');
});
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});