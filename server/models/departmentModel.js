const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required:true
    }
})

const Departments = mongoose.model("Department", departmentSchema)
module.exports= Departments