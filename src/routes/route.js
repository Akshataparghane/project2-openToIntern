const express = require("express");
const router = express.Router()
const collegeController = require('../Controllers/collegeController')
const internController = require('../Controllers/internController')



// router.post("/test-me", function (req, res) {
//     res.send("server is running cool hai")
// })

router.post("/functionup/colleges", collegeController.createCollege)
router.post("/functionup/interns", internController.createIntern)

router.get("/functionup/collegeDetails", collegeController.getcollegeDetails)

router.all("/*/*", async function(req, res)
{
    return res.status(404).send({status: false, message: "Not found, please check url"})
})



module.exports = router