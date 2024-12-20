const { UserModel } = require("../models/UserModel");
const {InterviewModel} = require("../models/InterviewModel");
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

const Registeruser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new UserModel({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};

const Loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });
        if (user) {
            if (user.password === password) {
                res.status(201).json({ message: 'User Logged-in successfully', user });
            }
            else {
                res.status(201).json({ message: 'User not Logged-in successfully', user });
            }
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }

}

const GetDetails = async (req, res) => {
    try {
        const email = req.query.email
        const user = await UserModel.findOne({ email: email })
        if (user) {
            return res.json(user)
        }
        else {
            return res.status(404).json({ message: 'User not found' })
        }
    }
    catch (err) {
        console.error(err);
    }
}

const Updateuser = async (req, res) => {
    try {
        const { CGPA, hsc, sslc, experience, college } = req.body;
        const email = req.query.email;

        const user = await UserModel.findOne({ email: email });

        if (user) {
            user.CGPA = CGPA;
            user.hsc = hsc;
            user.sslc = sslc;
            user.experience = experience;
            user.college = college;

            await user.save();
            return res.status(200).json({ message: 'Updated successfully' });
        } else {
            return res.status(404).json({ message: 'User not found, updation failed' });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while updating details' });
    }
};

const Uploadresume = async (req, res) => {
    try {
        const resumePath = req.file.path;
        const email = req.query.email;

        const user = await UserModel.findOne({ email: email });
        if (user) {
            user.resume = resumePath;
            await user.save();
            return res.status(200).send({ message: 'Resume uploaded successfully' });
        } else {
            return res.status(404).send({ message: 'User not found' });
        }

    }
    catch (err) {
        console.error(err);
    }
}

const GetInterviews = async (req, res) => {
    const candidate = req.query.candidate;
  
    try {
      const interviews = await InterviewModel.find({ candidate: candidate });
  
      return res.json(interviews);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch interviews" });
    }
  };

  const Getplaced = async (req, res) => {
    try {
      const email = req.query.email;
      const user = await UserModel.findOne({ email: email }); 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const company = user.company;
      if (company) {
        return res.json({ message: `You got placed, contact - ${company}` });
      } else {
        return res.json({ message: 'You are still not yet placed' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

module.exports = { Registeruser, Loginuser, GetDetails, Updateuser, Uploadresume, GetInterviews , Getplaced};
