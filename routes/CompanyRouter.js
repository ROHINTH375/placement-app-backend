const express = require('express');
const router = express.Router();
const {Registercompany, Logincompany, Getdetails, Getcandidates, ScheduleInterview, getInterviews, GetOne, Makeselect, Getselected} = require("../controllers/CompanyController")
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/register",upload.single('image'), Registercompany)
router.post("/companylogin", Logincompany)
router.get("/getdetails", Getdetails)
router.get("/getcandidates", Getcandidates)
router.get("/schedule", ScheduleInterview)
router.get("/getInterviews", getInterviews)
router.get("/getone", GetOne)
router.get("/select", Makeselect)
router.get('/getselected', Getselected)

module.exports = { CompanyRouter: router };