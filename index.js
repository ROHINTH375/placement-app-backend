const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs'); 
const path = require('path'); 
const { UserRouter } = require('./routes/UserRouter'); 
const {CompanyRouter} = require('./routes/CompanyRouter')
const {UserModel} = require("./models/UserModel");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); 
const mongoURI = 'mongodb+srv://rohinth1904:hLSK8rLRxYw6Kyje@cluster0.upwye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(mongoURI)
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((err) => {
    console.error('MongoDB connection failed:', err);
});

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log(req.file); 
    res.send('File uploaded successfully!');
});

app.use('/user', UserRouter);
app.use('/company', CompanyRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



