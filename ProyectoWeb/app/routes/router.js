const express = require('express');
const path = require('path');
const User = require('../models/users');
const UserInfo = require('../models/UsersInfo');


const router = express.Router();

// Ruta para servir pag de registro
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'register.html'));
});

// Ruta para procesar el registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();

        // Redirige a la pag de login con el parámetro de éxito
        res.redirect('/auth/login?success=true');
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el usuario' });
    }
});



// Ruta para servir la página de login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'login.html'));
});

// Ruta para procesar el login de usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Log para verificar si el usuario es encontrado y la sesión se asigna correctamente
        console.log("Usuario encontrado:", user);
        
        // Guarda el ID del usuario en la sesión
        req.session.userId = user._id;

        // Verifica si existe `UserInfo` asociado al usuario y redirige según el caso
        const userInfo = await UserInfo.findOne({ userId: user._id });
        console.log("Información del usuario:", userInfo);

        if (userInfo) {
            res.redirect('/dashboard');
        } else {
            res.redirect('/cuestionario');
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});



module.exports = router;