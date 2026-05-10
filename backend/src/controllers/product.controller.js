const productModel = require('../models/product.model')
const fs = require('fs')

const createProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.fields
        const { image } = req.files

        if (!name || !price || !description || !category) {
            return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบ" });
        }

        if (image && image.size > 1000000) {
            return res.status(400).json({ success: false, message: "รูปควรมีขนาดน้อยกว่าหรือเท่ากับ 1 mb" })
        }

        const newProduct = new productModel({ ...req.fields })

        if (image) {
            newProduct.image.data = fs.readFileSync(image.path)
            newProduct.image.contentType = image.type
        }
        await newProduct.save()

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: newProduct,
        });
    } catch (error) {
        console.error("CreateProduct Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getAllProduct = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate('category')
            .sort({ createdAt: -1 });

        const count = await productModel.countDocuments();

        res.status(200).json({ success: true, data: products, count });
    } catch (error) {
        console.error("GetAllProduct Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getByImageProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id).select("image");
        if (product && product.image && product.image.data) {
            res.set("Content-type", product.image.contentType);
            return res.status(200).send(product.image.data);
        }
        res.status(404).json({ success: false, message: "Image not found" });
    } catch (error) {
        console.error("GetByImageProduct Error:", error);
        res.status(500).json({ success: false, message: "Error while getting photo product" });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await productModel.findById(id).populate("category")

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Single Product Fetched",
            data: product,
        });
    } catch (error) {
        console.error("GetProductById Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, category } = req.fields;
        const { image } = req.files;

        if (image && image.size > 1000000) {
            return res.status(400).json({ success: false, message: "รูปควรมีขนาดน้อยกว่าหรือเท่ากับ 1 mb" });
        }

        const updatedProduct = await productModel.findByIdAndUpdate(id, {
            ...req.fields,
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (image) {
            updatedProduct.image.data = fs.readFileSync(image.path);
            updatedProduct.image.contentType = image.type;
        }

        await updatedProduct.save();

        res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            data: updatedProduct,
        });
    } catch (error) {
        console.error("UpdateProduct Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully",
            data: deletedProduct,
        });
    } catch (error) {
        console.error("DeleteProduct Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = {
    createProduct,
    getAllProduct,
    getByImageProduct,
    getProductById,
    updateProduct,
    deleteProduct
}