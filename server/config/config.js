//==============================
//  Puerto
//==============================
process.env.PORT = process.env.PORT || 3000;

//==============================
//  Entorno
//==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============================
//  Vencimiento del token
//==============================
//60 segundos
//60 minutos
//24 horas
//30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==============================
//  SEED de autenticacion
//==============================
process.env.SEED = process.env.NODE_ENV || 'alicia-en-el-pais-de-las-maravillas-desarrollo';

//==============================
//  Base de datos
//==============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//==============================
//  google Client ID
//==============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '793135939310-plea2b36g3c0u53ct8rhq71rkq5mofk7.apps.googleusercontent.com';