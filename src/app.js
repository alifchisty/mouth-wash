const express = require('express');
const app = express();
const hbs = require(`hbs`)
const port = process.env.PORT || 2000;
const path = require(`path`);
const bodyParser = require('body-parser');
require("../src/db/conn");
const idgen = require("../src/models/register");
const User = require("../src/models/usdt");

const DepositRequest = require('../src/models/user');
const { v4: uuidv4 } = require('uuid');

//public static path
const static_path= path.join(__dirname, "../public");
const template_path= path.join(__dirname, "../tamplates/views") 
const partials_path = path.join(__dirname, "../templates/partials")
// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path));
app.use(bodyParser.json())

app.set(`view engine`, `hbs`);
app.set(`views`, template_path);
hbs.registerPartials(partials_path);


//routing
app.get (``, (req , res)=>{
res.render("index")
})
app.get (`/indexx`, (req , res)=>{
res.render("indexx")
})

app.get (`/login`, (req , res)=>{
res.render("login")
})

app.get('/vip', (req, res) => {
    const vipuserId = req.query.vipuserId;
    if (!vipuserId) {
        return res.status(400).send('Invalid user ID');
    }
    res.render('vip', { vipuserId });
});



app.get('/Home', (req, res) => {
  res.render('home');
});

app.get('/index', (req, res) => {
  res.render('index');
});

app.get('/Mine', (req, res) => {
  res.render('mine');
});
app.get('/expe', (req, res) => {
  res.render('expe');
});
app.get('/Income', (req, res) => {
  res.render('income');
});

app.get('/Connection', (req, res) => {
  res.render('connection');
});

app.get('/About', (req, res) => {
  res.render('about');
});

app.get('/withdraw', (req, res) => {
  res.render('withdraw');
});
app.get('/test', (req, res) => {
  res.render('test');
});

app.get('/deposit', (req, res) => {
  res.render('deposit');
});
app.get('/team', (req, res) => {
  res.render('team');
});
app.get('/usdt', (req, res) => {
  res.render('usdt');
});
app.get('/api/checkUserId', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ exists: false });
    }
    const user = await idgen.findOne({ userId });
    res.json({ exists: !!user });
});

app.get('/api/getCommission', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        let user = await idgen.findOne({ userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ commission: user.principalAmount });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('*', (req, res) => {
  res.render('404');
});
app.post('/register', async (req, res) => {
    const { username, email, country, phone, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match');
    }

    function generateUserId() {
        const uuid = uuidv4().replace(/-/g, ''); // Remove dashes from UUID
        return uuid.slice(0, 12); // Extract the first 12 characters
    }

    const userId = generateUserId();

    const user = new idgen({ username, email, country, phone, password, userId });

    try {
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
 });
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await idgen.findOne({ email, password });

//         if (user) {
//             const userData = await  idgen.findOne({ userId: user.userId });
//             const score = userData ? userData.coins : 0; // Retrieve the coins from User schema
//             res.json({ success: true, username: user.username, userId: user.userId, score });
//         } else {
//             res.status(400).json({ success: false, message: 'Invalid email or password' });
//         }
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error logging in' });
//     }
// });
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await idgen.findOne({ email, password });

        if (user) {
            const userData = await idgen.findOne({ userId: user.userId });
            const score = userData ? userData.coins : 0; // Retrieve the coins from User schema
            res.json({ success: true, username: user.username, userId: user.userId, score });
        } else {
            res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});
// deposit-request endpoint
// app.post('/deposit-request', async (req, res) => {
//     const { package, userId } = req.body;

//     try {
//         let depositRequest = await DepositRequest.findOne({ userId });

//         if (depositRequest) {
//             // Update existing request
//             depositRequest.package = package;
//             depositRequest.requestTime = Date.now(); // Update request time

//             await depositRequest.save();
//             res.json({ message: 'Deposit request updated successfully' });
//         } else {
//             // Create a new deposit request
//             depositRequest = new DepositRequest({ package, userId });
//             await depositRequest.save();
//             res.json({ message: 'Deposit request submitted successfully' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while processing your deposit request. Please try again later.' });
//     }
// });

// // check-deposit endpoint
// app.post('/check-deposit', async (req, res) => {
//     const { userId } = req.body;

//     try {
//         const depositRequest = await DepositRequest.findOne({ userId });

//         if (depositRequest) {
//             res.json({ electronic: depositRequest.electronic, score: depositRequest.score });
//         } else {
//             res.status(404).json({ error: 'Deposit request not found for this user.' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while checking your deposit status. Please try again later.' });
//     }
// });



// deposit-request endpoint
app.post('/deposit-request', async (req, res) => {
    const { package, userId, details } = req.body;

    try {
        let depositRequest = await DepositRequest.findOne({ userId });

        if (depositRequest) {
            // Update existing request
            depositRequest.package = package;
            depositRequest.requestTime = Date.now(); // Update request time
            depositRequest.details = details; // Update details

            await depositRequest.save();
            res.json({ message: 'Deposit request updated successfully' });
        } else {
            // Create a new deposit request
            depositRequest = new DepositRequest({ package, userId, details });
            await depositRequest.save();
            res.json({ message: 'Deposit request submitted successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your deposit request. Please try again later.' });
    }
});

// check-deposit endpoint
app.post('/check-deposit', async (req, res) => {
    const { userId } = req.body;

    try {
        const depositRequest = await DepositRequest.findOne({ userId });

        if (depositRequest) {
            res.json({ electronic: depositRequest.electronic, score: depositRequest.score });
        } else {
            res.json({ electronic: 0, score: 0 }); // Return default values if no deposit request is found
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while checking your deposit status. Please try again later.' });
    }
});



app.post('/api/verify-password', async(req, res) => {
    const { username, password } = req.body;
    try {
        const user = await idgen.findOne({ username });
        if (user && user.password === password) { // Compare plain text passwords
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

function getDailyLimit(cost) {
    switch (cost) {
        case 9000: return 300;
        case 18000: return 300;
        case 30000: return 300;
        case 60000: return 300;
        default: return 300;
    }
}

app.post('/income', async (req, res) => {
    try {
        const { userId, packageCost, income } = req.body;

        if (!userId || isNaN(packageCost) || isNaN(income)) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        let user = await idgen.findOne({ userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Initialize dailyLimit if it is not already
        if (!user.dailyLimit) {
            user.dailyLimit = [];
        }

        const today = new Date().toISOString().slice(0, 10);

        let dailyLimitEntry = user.dailyLimit.find(entry => entry.packageCost === packageCost);

        if (!dailyLimitEntry) {
            dailyLimitEntry = { packageCost, date: today, count: 0 };
            user.dailyLimit.push(dailyLimitEntry);
        }

        if (dailyLimitEntry.date !== today) {
            dailyLimitEntry.date = today;
            dailyLimitEntry.count = 0;
        }

        const dailyLimit = getDailyLimit(packageCost);
        if (dailyLimitEntry.count >= dailyLimit) {
            return res.status(400).json({ error: 'Daily limit reached' });
        }

        user.score += income;
        dailyLimitEntry.count += 1;

        // Handle commission
       if (user.referredUserId) {
    let referredUser = await idgen.findOne({ userId: user.referredUserId });
    if (referredUser) {
        let commission = income * 0.1; // 10% of income
        referredUser.score += commission;
        referredUser.principalAmount += commission; // Store commission amount
        await referredUser.save();
    }
}


        await user.save();
        res.json({ userId, score: user.score });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



app.post('/api/setReferral', async (req, res) => {
    try {
        const { userId, referredUserId } = req.body;

        if (!userId || !referredUserId) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        let user = await idgen.findOne({ userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.referredUserId = referredUserId;
        await user.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



// app.post('/income', async (req, res) => {
//     try {
//         const { userId, packageCost, income } = req.body;

//         if (!userId || isNaN(packageCost) || isNaN(income)) {
//             return res.status(400).json({ error: 'Invalid input data' });
//         }

//         let user = await idgen.findOne({ userId });

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Initialize dailyLimit if it is not already
//         if (!user.dailyLimit) {
//             user.dailyLimit = [];
//         }

//         const today = new Date().toISOString().slice(0, 10);

//         let dailyLimitEntry = user.dailyLimit.find(entry => entry.packageCost === packageCost);

//         if (!dailyLimitEntry) {
//             dailyLimitEntry = { packageCost, date: today, count: 0 };
//             user.dailyLimit.push(dailyLimitEntry);
//         }

//         if (dailyLimitEntry.date !== today) {
//             dailyLimitEntry.date = today;
//             dailyLimitEntry.count = 0;
//         }

//         const dailyLimit = getDailyLimit(packageCost);
//         if (dailyLimitEntry.count >= dailyLimit) {
//             return res.status(400).json({ error: 'Daily limit reached' });
//         }

//         user.score += income;
//         dailyLimitEntry.count += 1;

//         await user.save();
//         res.json({ userId, score: user.score });
//     } catch (error) {
//         console.error('Error occurred:', error.message);
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// });
app.post('/api/withdraw', async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        let user = await idgen.findOne({ userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.score < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        user.score -= amount;
        user.withdrawals.totalAmount += amount;
        user.withdrawals.lastWithdrawalDate = new Date();

        await user.save();

        res.json({ message: 'Withdrawal successful', score: user.score });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
