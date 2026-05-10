const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Helper for unified registration
const handleRegister = async (req, res, role) => {
    try {
        const { title, firstName, lastName, email, password, tel } = req.body;

        // Validation
        if (!title || !firstName || !lastName || !email || !password || !tel) {
            return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบ" });
        }

        if (tel.length !== 10) {
            return res.status(400).json({ success: false, message: "กรุณากรอกเบอร์โทรให้ครบ 10 ตำแหน่ง" });
        }

        // Check existing user
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "อีเมลนี้ถูกใช้งานแล้ว" });
        }

        const existingTel = await userModel.findOne({ tel });
        if (existingTel) {
            return res.status(400).json({ success: false, message: "เบอร์โทรนี้ถูกใช้งานแล้ว" });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await new userModel({
            title,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            tel,
            role
        }).save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const registerSale = async (req, res) => {
    await handleRegister(req, res, "sale");
};

const registerAdmin = async (req, res) => {
    await handleRegister(req, res, "admin");
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "กรุณากรอกอีเมลและรหัสผ่าน" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "อีเมลไม่ได้ลงทะเบียน",
            });
        }

        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'รหัสผ่านไม่ถูกต้อง'
            });
        }

        const jwtToken = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: "Login successfully",
            data: {
                user: {
                    _id: user._id,
                    full_name: `${user.title} ${user.firstName} ${user.lastName}`,
                    email: user.email,
                    tel: user.tel,
                    role: user.role,
                },
                token: jwtToken
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    registerAdmin,
    registerSale,
    login
}