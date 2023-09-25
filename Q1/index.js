const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files
app.use(express.static('public'));


mongoose.connect('mongodb://0.0.0.0:27017/registration_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("connected to the database");
})
    .catch((err) => {
        console.log("Error while connecting to the database");
        process.exit();
    });

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    avatar: String,
    gallery: [String],
});

const User = mongoose.model('usertb', UserSchema);


const option = multer.diskStorage({
    destination: "./upload/",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    },
});

const upload = multer({ storage: option });

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/registration.html');
});

app.post('/register',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'gallery', maxCount: 5 },
    ]),
    [
        body('name').trim().isLength({ min: 2 }).escape().withMessage('Name must be at least 2 characters long'),
        body('email').isEmail().normalizeEmail(),
        body('password').trim().isLength({ min: 6 }).escape().withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        const avatar = req.files['avatar'] ? req.files['avatar'][0].filename : null;
        const gallery = req.files['gallery'] ? req.files['gallery'].map((file) => file.filename) : [];
        const newUser = new User({ name, email, password, avatar, gallery });

        try {
            await newUser.save();
            res.json({ message: 'User registered successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
)

app.listen(8000, () => {
    console.log(`Server is running on port ${8000}`);
});