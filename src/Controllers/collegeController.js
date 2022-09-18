const collegeModel = require('../Models/collegeModel')
const internModel = require('../Models/internModel')
const { default: mongoose } = require('mongoose');



//===========validation========================

const isVaildRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}


const isValidfullname = function (value) {
    let regex = /^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/
    return regex.test(value)
}

const isValidname = function (value) {
    let regex = /^[a-zA-Z]+[\.-]?[a-zA-Z]+$/
    return regex.test(value)
}

const isValidURL = function (value) {
    let URLregex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
    return URLregex.test(value)
}


//----------------------------------------------------Create Colleges ---------------------------------------------------------------

const createCollege = async function (req, res) {
    try {
        let collegeData = req.body
        let queryparam = req.param
        const { name, fullName, logoLink } = collegeData
        if (!isVaildRequestBody(collegeData)) return res.status(400).send({ status: false, message: "no input by user" })
        if(isVaildRequestBody(queryparam)) return res.status(400).send({status:false, message: "Invalid request"})

        if (!name) return res.status(400).send({ status: false, message: "College name is required" })
        if (!isValidname(name)) return res.status(400).send({ status: false, message: "enter valid name in abbreviated form" })

        let duplicateName = await collegeModel.findOne({ name })
        if (duplicateName) return res.status(400).send({ status: false, message: "name already exist" })

        if (!fullName) return res.status(400).send({ status: false, message: "college fullname is required" })
        if (!isValidfullname(fullName)) return res.status(400).send({ status: false, message: "Enter valid fullname" })
        if (!logoLink) return res.status(400).send({ status: false, message: "logoLink is required" })
        if (!isValidURL(logoLink)) return res.status(400).send({ status: false, message: "logoink is not valid" })

        let newCollege = await collegeModel.create(collegeData)
        return res.status(201).send({ status: true, message: "successfully created", data: newCollege })
    }
    catch (error) { return res.status(500).send({ status: false,  message: error.message }) }

}


//--------------------------------------------------- Get Colleges with applicable intern ---------------------------------------------------------


const getcollegeDetails = async function (req, res) {
    try {
        let collegeName = req.query.collegeName
        if (!(collegeName)) { return res.status(400).send({ status: false, message: "please enter name in query" }) }
        if (!isValidname(collegeName)) return res.status(400).send({ status: false, message: "enter valid collegeName in abbreviated form" })

        let collegeDetail = await collegeModel.findOne({ name: collegeName, isDeleted: false })
        if (!collegeDetail) return res.status(404).send({ status: false, message: "No college found with this name" })

        let collegeid = collegeDetail._id

        let findIntern = await internModel.find({ collegeId: collegeid }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        if(findIntern.length == 0) findIntern =  "No intern applicable"

        const allinterns = {
            "name": collegeDetail.name,
            "fullname": collegeDetail.fullName,
            "logoLink": collegeDetail.logoLink,
            "isDeleted": collegeDetail.isDeleted,
            "intern": findIntern
        }

        return res.status(200).send({ status: true, message: "Internship application successfull", data: allinterns })

    } catch (error) { return res.status(500).send({status: false, message: error.message }) }

}



module.exports.createCollege = createCollege
module.exports.getcollegeDetails = getcollegeDetails