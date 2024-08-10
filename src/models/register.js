const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    userId: { type: String, unique: true },
    score: { type: Number, default: 0 },
    dailyLimit: [
        {
            packageCost: { type: Number, required: true },
            date: { type: String, required: true },
            count: { type: Number, default: 0 }
        }
    ],
    withdrawals: {
        totalAmount: { type: Number, default: 0 },
        lastWithdrawalDate: { type: Date }
    },
    referredUserId: { type: String }, // New field for referral
    principalAmount: { type: Number, default: 0 } // New field for commission
});

const idgen = mongoose.model('idgen', userSchema);

module.exports = idgen;
  