// routes/cuestionario.js
const express = require('express');
const path = require('path');
const UserInfo = require('../models/UsersInfo');

const router = express.Router();

router.get('/', (req, res) => {
    // Verifica si el usuario está autenticado
    if (!req.session.userId) {
        return res.redirect('/auth/login'); // Redirige al login si no está autenticado
    }

    res.sendFile(path.join(__dirname, '../public/views', 'cuestionario.html'));
});

router.post('/', async (req, res) => {
    try {
        const userId = req.session.userId;

        // Verifica si el usuario está autenticado
        if (!userId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const { monthlyIncome, averageExpenses, additionalIncome, savingGoal, spendingGoal } = req.body;

        const userInfo = new UserInfo({
            userId,
            monthlyIncome,
            averageExpenses,
            additionalIncome,
            savingGoal,
            spendingGoal
        });

        await userInfo.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error al guardar el cuestionario:", error);
        res.status(500).json({ error: 'Error al guardar el cuestionario' });
    }
});

module.exports = router;
