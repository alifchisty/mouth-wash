const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    score: { type: Number, default: 0 },
    dailyLimit: [
        {
            packageCost: { type: Number, required: true },
            date: { type: String, required: true },
            count: { type: Number, default: 0 }
        }
    ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
