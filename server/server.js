require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser')



// parse application/x-www-form-urlencoded. Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json. Middleware
app.use(bodyParser.json());

// configuración global de rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});


let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Conectados a la base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});