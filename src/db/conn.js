const mongoose = require ("mongoose")

const mongoURI = 'mongodb+srv://aichisty115:ANDIMANDIsandi123@first-short.i3qyh.mongodb.net/reliability?retryWrites=true&w=majority&appName=first-short';
// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));