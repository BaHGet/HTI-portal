const userModel = require('../models/users')

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select(['-passwordHash', '-email'])
        res.json({success: true, users})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Something went wrong", error})
    }
}



const addUser = async (req, res) => {
    try {
        const { email, nationalId} = req.body;

        const userData = {
            email, nationalId
        }

        const newUser = new userModel(userData);
        await newUser.save();

        res.status(201).json({ success: true, message: "user added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}


const getUserById = async (req, res) => {
    try {
        const {userId} = req.body;

        const userData = await userModel.findById(userId);
        res.status(200).json({success : true, userData})
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

module.exports = {getAllUsers, addUser, getUserById}