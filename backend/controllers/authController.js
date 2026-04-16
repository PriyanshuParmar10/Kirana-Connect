const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const register = async (req, res) => {
    try {
        const { phoneNumber, password, role, email } = req.body;

        if (!phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Phone number, password and role are required"
            });
        }

        const userExists = await UserModel.findOne({ phoneNumber });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({
            phoneNumber,
            password: hashedPassword,
            role,
            email
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                phoneNumber: user.phoneNumber,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        const user = await UserModel.findOne({ phoneNumber });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                phoneNumber: user.phoneNumber,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: "Invalid phone number or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    const user = await UserModel.findById(req.user.id).select("-password");
    res.json(user);
};

module.exports = { register, login, getMe };