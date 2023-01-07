const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({ email, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, "jwtsecret");
        return res.status(200).json({
            token: token
        })
    } catch (err) {
        return res.status(422).json(err.message)
    }
})

router.post("/signin", async (req, res) => {

    const { email, password } = req.body;


    if (!email || !password) { return res.status(422).json({ error: "Please provide email and password." }) }

    const user = await User.findOne({ email });

    if (!user) { return res.status(422).json({ error: "User not found with this email." }) }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, "jwtsecret")
        res.json({ token })
    } catch (err) {
        return res.status(422).json({ error: "Invalid password or email." })
    }
})


module.exports = router;