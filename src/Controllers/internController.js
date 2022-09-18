const collegeModel = require('../Models/collegeModel')
const internModel = require('../Models/internModel')
const { default: mongoose } = require('mongoose');

//================validation==============

const isValidRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}

const isValidEmail = function (value) {
    const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexForEmail.test(value)
}

const isValidNumber = function (value) {
    const regexForNumber = /^([+]\d{2})?\d{10}$/              ///^[0-9]\d{0-9}$/ 
    return regexForNumber.test(value)
}

const isValidname = function (value) {
    let regex =/^[a-zA-Z]+([\s][a-zA-Z]+)*$/            
    return regex.test(value)
}

const isValidCollegeName = function (value) {
    let regex = /^[a-zA-Z]+[\.-]?[a-zA-Z]+$/
    return regex.test(value)
}
//============================================


//----------------------------------------------------Create Interns------------------------------------------------------------


const createIntern = async function (req, res) {
    try {
        let internData = req.body
        let queryparam = req.query
        const { name, email, mobile, collegeName } = internData
        if (!isValidRequestBody(internData)) return res.status(400).send({ status: false, message: "No input by user.." })
        if(isValidRequestBody(queryparam)) return res.status(400).send({status:false, message: "Invalid request"})

        if (!name) return res.status(400).send({ status: false, message: "Intern's name is required." })
        if (!isValidname(name)) return res.status(400).send({ status: false, message: "Enter valid name i.e. fullname" })

        if (!email) return res.status(400).send({ status: false, message: "Intern's email is required." })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Enter a valid email" })

        let useEmail = await internModel.findOne({ email })
        if (useEmail) return res.status(400).send({ status: false, message: "email is already exist" })

        if (!mobile) return res.status(400).send({ status: false, message: "Intern's mobile is required." })
        if (!isValidNumber(mobile)) return res.status(400).send({ status: false, message: "Enter valid mobile" })

        let useMobile = await internModel.findOne({ mobile })
        if (useMobile) return res.status(400).send({ status: false, message: "mobile is already exist" })

        if (!collegeName) return res.status(400).send({ status: false, message: "Intern's collegeName is required." })
        if (!isValidCollegeName(collegeName)) return res.status(400).send({ status: false, message: "Enter valid collegeName" })

        let getcollegeid = await collegeModel.findOne({ name: collegeName, isDeleted: false })
        if (!getcollegeid) return res.status(404).send({ status: false, message: "No college found with this name" })

        let collegeId = getcollegeid._id
        let newIntern = { name, email, mobile, collegeId }


        let newInterndata = await internModel.create(newIntern)
        return res.status(201).send({ status: true, message: "successfully created", data: newInterndata })
    }
    catch (error) { return res.status(500).send({status: false, message: error.message }) }
}



module.exports.createIntern = createIntern