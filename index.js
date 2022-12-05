require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webRoutes = require('./routes/web.routes');
const cors = require('cors');
const dbConexion = require('./database/db');
const app = express();

let port = process.env.PORT || 8080;

app.use( express.json() );
app.use( bodyParser.json() );
app.use( cors() );
app.use( bodyParser.urlencoded({ extended: false }) );

// base de datos
dbConexion();
// ===__********** Carpeta pública  **********__===
app.use( express.static('public') );

// ===__********** Rutas  **********__===
app.use( '/', webRoutes );
app.use('/api/prospecto', require( './routes/prospecto.routes' ));
app.use('/api/usuario', require( './routes/usuarioAuth.routes' ));
app.use('/api/pedido', require( './routes/pedido.routes' ));
app.use('/api/test', require( './routes/test.routes'));
// ===__********** Arrancar servidor  **********__===
//todo
app.listen( port, () => {
    console.log( 'Servidor iniciando en puerto: ' + port );
});