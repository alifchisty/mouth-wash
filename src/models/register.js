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
        lastWithdrawalDate: { type: Date },
        history: [
            {
                amount: { type: Number, required: true },
                date: { type: Date, required: true }
            }
        ]
    }, 
    referredUserId: { type: String },
    principalAmount: { type: Number, default: 0 }
});

const idgen = mongoose.model('idgen', userSchema);
module.exports = idgen;
