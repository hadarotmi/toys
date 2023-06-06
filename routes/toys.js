const express = require("express")
const { ToyModel, validToy } = require("../models/toysModel")
const { authToken } = require("../auth/authToken")
const router = express.Router()

router.get("/all", async (req, res) => {
    let perPage = req.query.perPage||10;
    let page = req.query.page || 1;
    try {
        let data = await ToyModel
            .find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})


router.get("/search", async (req, res) => {
    let perPage = req.query.perPage||10;
    let page = req.query.page || 1;
    let search=req.query.s
    try {
        let data = await ToyModel
            .find({ $or: [{ name: { $regex: search} }, { info: { $regex: search } }] })
            .limit(perPage)
            .skip((page - 1) * perPage)
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.get("/price", async (req, res) => {
    let perPage = req.query.perPage||10;
    let page = req.query.page || 1;
    let minPrice=req.query.min
    let maxPrice=req.query.max

    try {
        let data = await ToyModel
            .find({ price: { $gte: minPrice, $lte: maxPrice }})
            .limit(perPage)
            .skip((page - 1) * perPage)
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.get("/category/:category", async (req, res) => {
    let perPage = req.query.perPage||10;
    let page = req.query.page || 1;
    let category=req.params.category
    try {
        let data = await ToyModel
            .find({category:category})
            .limit(perPage)
            .skip((page - 1) * perPage)
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})
router.get("/single/:id", async (req, res) => {
    let idToys=req.params.id
    try {
        let data = await ToyModel.find({_id:idToys})
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})


router.post("/", authToken, async (req, res) => {
    req.body.user_id= req.tokenData._id
    let validBody = validToy(req.body)
    if (validBody.error) {
        return res.status(404).json(validBody.error.details)
    }
    let site = new ToyModel(req.body)
    site.save()
    res.json(site)
})

router.delete("/:idDel", authToken, async (req, res) => {
    try {
        let data = await ToyModel.deleteOne({ _id: req.params.idDel, user_id:req.tokenData._id })
        if(data.deletedCount==0){
            return res.status(401).json({msg:"This toy is not found in your toys"})
        }
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send(err)

    }
})


router.put("/:idEdit", authToken, async (req, res) => {
    req.body.user_id= req.tokenData._id

    let validBody = validToy(req.body)
    if (validBody.error) {
        return res.status(404).json(validBody.error.details)
    }
    try {
        let data = await ToyModel.updateOne({ _id: req.params.idEdit,user_id:req.tokenData._id }, req.body)
        if(data.matchedCount==0){
            return res.status(401).json({msg:"This toy is not found in your toys"})
        }
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send(err)

    }
})

module.exports = router