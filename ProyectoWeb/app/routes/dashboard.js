// routes/dashboard.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const UserInfo = require('../models/UsersInfo');
// routes/dashboard.js
const { Expense, Income } = require('../models/expense');
const FixedExpense = require('../models/gastoFijo');


const router = express.Router();

// Ruta para mostrar el dashboard con datos de ingresos y gastos
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const userInfo = await UserInfo.findOne({ userId });

        if (!userInfo) {
            return res.redirect('/cuestionario');
        }

        // Datos de ingresos y gastos
        const monthlyIncome = userInfo.monthlyIncome;
        const averageExpenses = userInfo.averageExpenses;

        // Envía el HTML del dashboard con datos de ingresos y gastos
        res.sendFile(path.join(__dirname, '../public/views', 'dashboard.html'));
    } catch (error) {
        console.error("Error al cargar el dashboard:", error);
        res.status(500).json({ error: 'Error al cargar el dashboard' });
    }
});

router.get('/api/dashboard-data', async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const userInfo = await UserInfo.findOne({ userId });
        if (!userInfo) {
            return res.status(404).json({ error: 'Información del usuario no encontrada' });
        }

        // Obtener gastos fijos
        const fixedExpensesDetails = await FixedExpense.find({ userId });
        const fixedExpenses = fixedExpensesDetails.reduce((sum, expense) => sum + expense.amount, 0);

        // Obtener gastos variables
        const variableExpensesResult = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const variableExpenses = variableExpensesResult[0]?.total || 0;

        // Obtener ingresos
        const incomes = await Income.find({ userId });
        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

        const totalExpenses = fixedExpenses + variableExpenses;
        const remainingBalance = totalIncome - totalExpenses;

        res.json({
            monthlyIncome: totalIncome,
            fixedExpenses: fixedExpenses,
            fixedExpensesDetails: fixedExpensesDetails.map(fixed => ({
                description: fixed.description,
                amount: fixed.amount,
                category: fixed.category
            })),
            variableExpenses: variableExpenses,
            expensesDetails: await Expense.find({ userId }), // Detalles de gastos variables
            incomesDetails: incomes, // Detalles de ingresos
            totalExpenses: totalExpenses,
            remainingBalance: remainingBalance,
            savingGoal: userInfo.savingGoal
        });
    } catch (error) {
        console.error("Error al obtener los datos del dashboard:", error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});





// Ruta para mostrar la página de agregar gasto
router.get('/add-expense', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'add_expense.html'));
});


// Ruta para procesar el formulario de agregar gasto
// routes/dashboard.js

router.post('/add-expense', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { amount, category, description } = req.body;

        // Asegurarse de que userId sea un ObjectId
        const objectId = new mongoose.Types.ObjectId(userId);

        // Crea un nuevo documento de gasto en la colección Expense
        const expense = new Expense({
            userId: objectId,
            amount,
            category,
            description
        });
        await expense.save();

        // Recalcula los gastos totales sumando todos los gastos del usuario
        const totalExpensesResult = await Expense.aggregate([
            { $match: { userId: objectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalExpenses = totalExpensesResult[0]?.total || 0;

        // Encuentra el documento del usuario y actualiza averageExpenses y remainingBalance
        const userInfo = await UserInfo.findOne({ userId: objectId });
        if (userInfo) {
            userInfo.averageExpenses = totalExpenses;
            userInfo.remainingBalance = userInfo.monthlyIncome - totalExpenses;
            await userInfo.save();
        }

        // Envía un JSON con el mensaje de éxito
        res.json({ success: true, message: 'Gasto agregado exitosamente' });
    } catch (error) {
        console.error("Error al agregar el gasto:", error);
        res.status(500).json({ success: false, error: 'Error al agregar el gasto' });
    }
});



// Ruta para mostrar la página de agregar ingreso
router.get('/add-income', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'add_income.html'));
});



// Ruta para procesar el formulario de agregar ingreso
router.post('/add-income', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { amount, source, description } = req.body;

        // Asegurarse de que userId sea un ObjectId
        const objectId = new mongoose.Types.ObjectId(userId);

        // Crea el documento de ingreso en la colección de historial
        const income = new Income({
            userId: objectId,
            amount,
            source,
            description
        });
        await income.save();

        // Recalcula el ingreso total sumando todos los ingresos del usuario
        const totalIncomeResult = await Income.aggregate([
            { $match: { userId: objectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalIncome = totalIncomeResult[0]?.total || 0;

        // Encuentra el documento del usuario y actualiza monthlyIncome y remainingBalance
        const userInfo = await UserInfo.findOne({ userId: objectId });
        if (userInfo) {
            userInfo.monthlyIncome = totalIncome;
            userInfo.remainingBalance = totalIncome - userInfo.averageExpenses;
            await userInfo.save();
        }
        // Enviar respuesta JSON sin redirigir
        res.json({ success: true, message: 'Ingreso agregado exitosamente' });
    } catch (error) {
        console.error("Error al agregar el ingreso:", error);
        res.status(500).json({ success: false, error: 'Error al agregar el ingreso' });
    }
});



// Ruta para obtener el historial de gastos e ingresos
router.get('/api/transaction-history', async (req, res) => {
    try {
        const userId = req.session.userId;

        // Obtener el historial de gastos e ingresos del usuario
        const expenses = await Expense.find({ userId });
        const incomes = await Income.find({ userId });

        res.json({ expenses, incomes });
    } catch (error) {
        console.error("Error al obtener el historial de transacciones:", error);
        res.status(500).json({ error: 'Error al obtener el historial' });
    }
});


module.exports = router;
