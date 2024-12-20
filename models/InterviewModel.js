const mongoose = require('mongoose');

const InterviewSchema = mongoose.Schema({
    company: String,
    candidate: String,
    Date: Date,  
    Time: String, 
});

const InterviewModel = mongoose.model('Interview', InterviewSchema);
module.exports = { InterviewModel };
