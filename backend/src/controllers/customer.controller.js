const customerModel = require('../models/customer.model');

const getInfoCustomer = async (req, res) => {
    try {
        const customers = await customerModel.find({ sale: req.user._id });
        res.status(200).json({ success: true, data: customers });
    } catch (error) {
        console.error("GetInfoCustomer Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const createCustomer = async (req, res) => {
    try {
        const { title, firstName, lastName, email, tel, address, sale } = req.body;

        if (!title || !firstName || !lastName || !email || !tel || !address || !sale) {
            return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบ" });
        }

        if (tel.length !== 10) {
            return res.status(400).json({ success: false, message: "กรุณากรอกเบอร์โทรให้ครบ 10 ตำแหน่ง" });
        }

        const existingEmail = await customerModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "อีเมลนี้ถูกใช้งานแล้ว" });
        }

        const existingTel = await customerModel.findOne({ tel });
        if (existingTel) {
            return res.status(400).json({ success: false, message: "เบอร์โทรนี้ถูกใช้งานแล้ว" });
        }

        const newCustomer = await new customerModel({
            title,
            firstName,
            lastName,
            email,
            tel,
            address,
            sale
        }).save();

         console.log(newCustomer)       
        res.status(201).json({ 
            success: true, 
            message: "Customer created successfully", 
            data: newCustomer 
        });
    } catch (error) {
        console.error("CreateCustomer Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getAllCustomer = async (req, res) => {
    try {
        const customers = await customerModel.find({}).populate('sale');
        res.status(200).json({ success: true, message: "All customers retrieved", data: customers });
    } catch (error) {
        console.error("GetAllCustomer Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await customerModel.findById(id).populate('sale');

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.status(200).json({ success: true, message: "Customer retrieved successfully", data: customer });
    } catch (error) {
        console.error("GetCustomerById Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, firstName, lastName, email, tel, address, sale } = req.body;

        if (!title || !firstName || !lastName || !email || !tel || !address || !sale) {
            return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบ" });
        }

        if (tel.length !== 10) {
            return res.status(400).json({ success: false, message: "กรุณากรอกเบอร์โทรให้ครบ 10 ตำแหน่ง" });
        }

        const updatedCustomer = await customerModel.findByIdAndUpdate(id, {
            title,
            firstName,
            lastName,
            email,
            tel,
            address,
            sale
        }, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.status(200).json({ success: true, message: "Customer updated successfully", data: updatedCustomer });
    } catch (error) {
        console.error("UpdateCustomer Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await customerModel.findByIdAndDelete(id);

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.status(200).json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
        console.error("DeleteCustomer Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = {
    createCustomer,
    getAllCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getInfoCustomer
}