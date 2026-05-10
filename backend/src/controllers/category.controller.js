const categoryModel = require('../models/category.model');
const slugify = require('slugify');

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบ" });
        }

        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "มีประเภทสินค้านี้อยู่แล้ว" });
        }

        const newCategory = await new categoryModel({
            name,
            slug: slugify(name),
        }).save();

        res.status(201).json({ 
            success: true, 
            message: "Category created successfully", 
            data: newCategory 
        });
    } catch (error) {
        console.error("CreateCategory Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getAllCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error("GetAllCategory Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.status(200).json({ success: true, message: "Single category fetched", data: category });
    } catch (error) {
        console.error("GetCategoryById Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบ" });
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "ไม่พบหมวดหมู่ที่ต้องการอัปเดต" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Category updated successfully", 
            data: updatedCategory 
        });
    } catch (error) {
        console.error("UpdateCategory Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await categoryModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "ไม่พบหมวดหมู่ที่ต้องการลบ" });
        }

        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        console.error("DeleteCategory Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}