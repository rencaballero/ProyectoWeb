// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Ruta para registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el usuario' });
    }
});

// Ruta para login de usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        // Puedes usar sesiones o JWT aquí para manejar la autenticación
        req.session.userId = user._id;
        res.json({ message: 'Login exitoso' });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
