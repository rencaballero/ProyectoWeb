// models/expense.js
const mongoose = require('mongoose');

// Definición del modelo de Expense
const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
});
const Expense = mongoose.model('Expense', expenseSchema);

// Definición del modelo de Income
const incomeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    source: { type: String }, // Ej. "Salario", "Freelance", etc.
    description: { type: String },
    date: { type: Date, default: Date.now }
});
const Income = mongoose.model('Income', incomeSchema);

// Exportar ambos modelos desde el mismo archivo
module.exports = { Expense, Income };
