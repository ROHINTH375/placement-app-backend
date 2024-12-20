const mongooose = require('mongoose')


const CompanySchema = mongooose.Schema({
    companyname: String,
    email: String,
    password: String,
    image: String,
})

const CompanyModel  = mongooose.model('Company', CompanySchema)

module.exports={CompanyModel}