const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3001;

// Importa las rutas correctamente
const authRoutes = require('./app/routes/router');
const cuestionarioRoutes = require('./app/routes/cuestionario');
const dashboardRoutes = require('./app/routes/dashboard');
const profileRoutes = require('./app/routes/perfil');


app.use(express.static('app/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect('mongodb+srv://itesopruebas:itesopruebas@web2.uqcyj.mongodb.net/?retryWrites=true&w=majority&appName=WEB2');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
}));

// Usar las rutas conm prefijos
app.use('/auth', authRoutes);
app.use('/cuestionario', cuestionarioRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/profile', profileRoutes);
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});