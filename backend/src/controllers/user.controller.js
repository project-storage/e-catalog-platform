const { hashPassword } = require('../helpers/authHelper');
const userModel = require('../models/user.model');

// Get user info by token
const getUserInfo = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("GetUserInfo Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get all users (sales)
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({ role: 'sale' }).select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("GetAllUsers Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Search users by role
const searchUserByRole = async (req, res) => {
    try {
        const { role } = req.query;

        if (!role) {
            return res.status(400).json({ success: false, message: "Role is required" });
        }

        const users = await userModel.find({ role }).select('-password');

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found with this role" });
        }

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("SearchUserByRole Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("GetUserById Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update own profile
const updateProfile = async (req, res) => {
    try {
        const { title, firstName, lastName, email, password, tel } = req.body;
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "ไม่พบผู้ใช้" });
        }

        // Check uniqueness for email and tel if changed
        if (email && email !== user.email) {
            const existingEmail = await userModel.findOne({ email });
            if (existingEmail) return res.status(400).json({ success: false, message: "อีเมลนี้ถูกใช้งานแล้ว" });
        }

        if (tel && tel !== user.tel) {
            const existingTel = await userModel.findOne({ tel });
            if (existingTel) return res.status(400).json({ success: false, message: "เบอร์โทรนี้ถูกใช้งานแล้ว" });
        }

        const updates = {
            title: title || user.title,
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email || user.email,
            tel: tel || user.tel,
        };

        if (password) {
            updates.password = await hashPassword(password);
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updates, { new: true }).select('-password');

        res.status(200).json({
            success: true,
            message: "อัปเดตข้อมูลผู้ใช้สำเร็จ",
            data: updatedUser
        });
    } catch (error) {
        console.error("UpdateProfile Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update user (admin functionality)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }

        const user = await userModel.findByIdAndUpdate(id, updates, { new: true }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("UpdateUser Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("DeleteUser Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getUserInfo,
    getAllUsers,
    searchUserByRole,
    getUserById,
    updateProfile,
    updateUser,
    deleteUser,
};