const mongoose = require('mongoose');

const fixedExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
});

const FixedExpense = mongoose.model('FixedExpense', fixedExpenseSchema);

module.exports = FixedExpense;