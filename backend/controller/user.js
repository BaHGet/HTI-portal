const userModel = require('../models/users')
const { Hashing } = require('../utils/hashingPass')


const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select(['passwordHash', 'email'])
        res.json({success: true, users})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Something went wrong", error})
    }
}

const addUser = async (req, res) => {
    const userData = req.body;
    try {
        userData.passwordHash = await Hashing(userData.password)
        delete userData.password
        const newUser = new userModel(userData);
        await newUser.save();
        res.status(201).json({ success: true, message: "user added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}


const getUser = async (req, res) => {
    try {
        const user = req.body;

        const userData = await userModel.findOne({email:user.email});
        res.status(200).json({success : true, userData})
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

module.exports = {getAllUsers, addUser, getUser}