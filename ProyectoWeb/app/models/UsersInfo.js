// models/UserInfo.js
const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    monthlyIncome: { type: Number, required: true },
    averageExpenses: { type: Number, required: true },
    additionalIncome: { type: Number, default: 0 },
    savingGoal: { type: Number, default: 0 },
    spendingGoal: { type: Number, default: 0 },
    // Agrega otros campos según sea necesario
});

module.exports = mongoose.model('UserInfo', userInfoSchema);
