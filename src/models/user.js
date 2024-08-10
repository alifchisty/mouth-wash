const mongoose = require('mongoose');

const depositRequestSchema = new mongoose.Schema({
    package: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return typeof v === 'string' && v.length > 0;
            },
            message: props => `${props.value} is not a valid user ID!`
        }
    },
    electronic: {
        type: Number,
        default: 0
    },
    requestTime: {
        type: Date,
        default: Date.now
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    details: {
        type: String,
        required: true
    }
});

depositRequestSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('DepositRequest', depositRequestSchema);
