const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    CGPA: { type: Number },
    college: { type: String },
    hsc: { type: String },
    sslc: { type: String },
    experience: { type: String },
    skills: [{ type: String }],
    resume: { type: String },
    status: { type: String },
    company: {type:String},
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = { UserModel };
