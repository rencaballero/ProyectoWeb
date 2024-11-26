const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const UserInfo = require('../models/UsersInfo');
const { Expense } = require('../models/expense');
const FixedExpense = require('../models/gastoFijo');


const router = express.Router();

// Ruta para servir la página de perflil
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'perfil.html'));
});

// Ruta para aatualiza datos personales
router.post('/update-personal-info', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const userId = req.session.userId;
        const { monthlyIncome, averageExpenses, savingGoal } = req.body;

        // Construir uobj con lo ppropor
        const updateFields = {};
        if (monthlyIncome && !isNaN(monthlyIncome)) {
            updateFields.monthlyIncome = parseFloat(monthlyIncome);
        }
        if (averageExpenses && !isNaN(averageExpenses)) {
            updateFields.averageExpenses = parseFloat(averageExpenses);
        }
        if (savingGoal && !isNaN(savingGoal)) {
            updateFields.savingGoal = parseFloat(savingGoal);
        }

        // Actualizar los datos del usuario
        const userInfo = await UserInfo.findOneAndUpdate(
            { userId },
            updateFields,
            { new: true } //returndocumento actualizado
        );

        if (!userInfo) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Datos personales actualizados correctamente.' });
    } catch (error) {
        console.error("Error al actualizar los datos personales:", error);
        res.status(500).json({ error: 'Error al actualizar los datos personales.' });
    }
});

// Ruta para agregar gastos fijos

router.post('/add-fixed-expense', async (req, res) => {
    try {
        const userId = req.session.userId; // Obten el ID del usuario de la sesión

        if (!userId) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const { expenseName, expenseAmount, expenseCategory } = req.body;

        // Crea un nuevo gasto fijo en la colección FixedExpense
        const fixedExpense = new FixedExpense({
            userId: new mongoose.Types.ObjectId(userId),
            amount: parseFloat(expenseAmount),
            category: expenseCategory,
            description: expenseName
        });

        await fixedExpense.save();

        res.json({ message: 'Gasto fijo agregado correctamente.' });
    } catch (error) {
        console.error("Error al agregar el gasto fijo:", error);
        res.status(500).json({ error: 'Error al agregar el gasto fijo.' });
    }
});




module.exports = router;