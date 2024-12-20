const {CompanyModel} = require("../models/CompanyModel");
const {UserModel} = require("../models/UserModel");
const {InterviewModel} =require("../models/InterviewModel");
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
      user: 'testmailalert20@gmail.com', 
      pass: 'qwghdvduxumxjidk', 
  },
});

const sendEmail = async (from, to, subject, text) => {
  const mailOptions = {
      from: from, 
      to: to,
      subject: subject, 
      text: text, 
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
  } catch (error) {
      console.error('Error sending email:', error);
  }
};


const Registercompany = async (req, res) => {
    try {
      const { companyname, email, password } = req.body;
  
      if (!companyname || !email || !password || !req.file) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const filepath = req.file.path;  
      const company = new CompanyModel({
        companyname,
        email,
        password,
        image: filepath  
      });
  
      await company.save();
  
      res.status(201).json({ message: "Company registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error occurred during registration. Please try again." });
    }
  };

const Logincompany=async(req,res)=>{
  try {
    const { email, password} = req.body;
    const company = await CompanyModel.findOne({ email:email });
    if(company){
      if(company.password === password){
        return res.json({message:'Company loggin successful'})
      }
      else{
        return res.status(401).json({message:'Invalid password'})
      }
    }
  }
  catch(err){
    console.error(err);
  }
}

const Getdetails=async(req,res)=>{
  try{
    const email = req.query.email;
    const company = await CompanyModel.findOne({email:email})
    return res.json(company)
  }
  catch(err)
  {
    console.error(err);
  }
}

const Getcandidates = async (req, res) => {
  try {
    const candidates = await UserModel.find(); 
    return res.status(200).json(candidates);
  } catch (err) {
    console.error(err); 
    return res.status(500).json({ message: "An error occurred while fetching candidates." });
  }
};

const ScheduleInterview = async (req, res) => {
  try {
    const company = req.query.company;
    const candidate = req.query.candidate;
    const date = req.query.date; 
    const time = req.query.time;

    if (!company || !candidate || !date || !time) {
      return res.status(400).json({ message: "All fields (company, candidate, date, time) are required." });
    }

    const interviewDate = new Date(date); 
    if (isNaN(interviewDate)) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const interview = new InterviewModel({
      company: company,
      candidate: candidate,
      Date: interviewDate,
      Time: time, 
    });

    await interview.save();
    subject="job portal"
    text="Your interview is scheduled view further details on job portal, best of luck! you have 3 rounds to clear"
    sendEmail(company, candidate, subject, text)
    return res.json({ message: "Interview scheduled successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to schedule interview." });
  }
}

const getInterviews = async(req,res)=>{
  try{
    const email = req.query.email
    const interviews = await InterviewModel.find({company:email})
    return res.json(interviews)
  }
  catch(err)
  {
    console.log(err)
  }
}

const GetOne = async (req, res) => {
  try {
    const candidateEmail = req.query.candidate;
    if (!candidateEmail) {
      return res.status(400).json({ message: "Candidate email is required" });
    }

    const user = await UserModel.findOne({ email: candidateEmail });

    if (!user) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error(err); 
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const Makeselect = async (req, res) => {
  try {
    const candidate = req.query.candidate;
    const company = req.query.company;
    
    const user = await UserModel.findOne({ email: candidate });
    
    if (user) {
      user.status = "selected";
      user.company = company;
      await user.save();
      res.status(200).send({ message: 'User selected successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server error' });
  }
};

const Getselected=async(req,res)=>{
 try{
  const company = req.query.company;
  const selected = await UserModel.find({ status: "selected", company: company });
  return res.json(selected)
 }
 catch(err)
 {
  console.log(err)
 }
}


module.exports = { Registercompany, Logincompany, Getdetails , Getcandidates, ScheduleInterview, getInterviews, GetOne, Makeselect, Getselected};
