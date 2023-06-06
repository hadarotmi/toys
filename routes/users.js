const express = require("express")
const { UserModel, validUser, validLogin, getToken } = require("../models/userModel")
const bcrypt = require("bcrypt")
const router = express.Router()
const jwt = require("jsonwebtoken");
const { authToken } = require("../auth/authToken")

router.get("/all", authToken, async (req, res) => {
    if ( req.tokenData.role == "admin") {
        let data = await UserModel.find({})
        res.json(data)
    } else {
        return res.status(401).json({ msg: "Only an administrator can view the user list" })
    }

})

router.post("/", async (req, res) => {
    let validBody = validUser(req.body)
    if (validBody.error) {
        res.status(404).json(validBody.error.details)
    }

    try {
        let user = new UserModel(req.body)
        user.pass = await bcrypt.hash(user.pass, 10)
        await user.save()
        user.pass = "******"
        res.json(user)

    } catch (err) {
        console.log(err);
        res.status(400).send({ err: "email already in system" })

    }
})

router.delete("/:idDel", authToken, async (req, res) => {
    let data;
    try {
        if (req.tokenData.role == "admin") {
            data = await UserModel.deleteOne({ _id: req.params.idDel })
        }
        else if (req.params.idDel == req.tokenData._id) {
            data = await UserModel.deleteOne({ _id: req.params.idDel })

        }
        else {
            return res.status(401).json({ msg: "You cannot delete a user who is not you" })
        }
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send(err)

    }
})


router.put("/:idEdit",authToken, async (req, res) => {
    let validBody = validUser(req.body)
    let data;
    req.body.pass=await bcrypt.hash(req.body.pass, 10)
    if (validBody.error) {
        res.status(404).json(validBody.error.details)
    }
    try {
        if (req.tokenData.role == "admin") {
            data = await UserModel.updateOne({ _id: req.params.idEdit }, req.body)
        }
        else if (req.params.idEdit == req.tokenData._id) {
            data = await UserModel.updateOne({ _id: req.params.idEdit}, req.body)
        }
        else {
            return res.status(401).json({ msg: "You cannot update a user who is not you" })
        }
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send(err)

    }
})


router.post("/login", async (req, res) => {
    let validBody = validLogin(req.body)
    if (validBody.error) {
        res.status(404).json(validBody.error.details)
    }
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
        return res.status(401).json({ msg: "user not found" })
    }
    let passValid = await bcrypt.compare(req.body.pass, user.pass)
    if (!passValid) {
        return res.status(401).json({ msg: "password wrong" })
    }

    let newToken = getToken(user.id, user.role);
    res.json({ your_token: newToken })

})

router.get("/myInfo", authToken, async (req, res) => {
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { pass: 0 });
    res.json(user)

})


module.exports = router