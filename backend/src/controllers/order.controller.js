const orderModel = require('../models/order.model');

const createOrder = async (req, res) => {
    const { customer, products, date, totalPrice, project } = req.body;
    const sale = req.user._id;

    try {
        const now = new Date();
        const currentYear = now.getFullYear().toString().slice(-2);
        const currentMonth = ('0' + (now.getMonth() + 1)).slice(-2);
        const yearMonth = currentYear + currentMonth;

        // Find the last order created in the same year and month
        const lastOrder = await orderModel.findOne({ estNo: { $regex: `^${yearMonth}` } })
                                          .sort({ estNo: -1 });

        let newSequence = '0001'; 
        if (lastOrder && lastOrder.estNo) {
            const lastSequence = parseInt(lastOrder.estNo.slice(-4), 10);
            newSequence = ('0000' + (lastSequence + 1)).slice(-4);
        }

        const newEstNo = yearMonth + newSequence;

        const newOrder = await new orderModel({
            estNo: newEstNo,
            customer,
            products,
            sale,
            totalPrice,
            status: "process",
            project,
            date: date ? new Date(date) : now,
        }).save();

        res.status(201).json({
            success: true,
            message: "Order Created Successfully",
            data: newOrder,
        });
    } catch (error) {
        console.error("CreateOrder Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
            .populate('customer')
            .populate({
                path: 'products.product',
                populate: { path: 'category' },
                select: '-image'
            })
            .populate('sale');

        res.status(200).json({
            success: true,
            message: "Orders Retrieved Successfully",
            data: orders
        });
    } catch (error) {
        console.error("GetAllOrders Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const searchByCustomer = async (req, res) => {
    try {
        const { status } = req.query;
        const { customer } = req.params;

        const orderByCustomer = await orderModel.find({ status, customer })
            .populate('customer')
            .populate({
                path: 'products.product',
                populate: { path: 'category' }
            })
            .populate('sale');

        res.status(200).json({ success: true, data: orderByCustomer });
    } catch (error) {
        console.error("SearchByCustomer Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const searchStatus = async (req, res) => {
    try {
        const { status } = req.query;

        const orderByStatus = await orderModel.find({ status })
            .populate('customer')
            .populate({
                path: 'products.product',
                populate: { path: 'category' },
                select: '-image'
            })
            .populate('sale');

        res.status(200).json({ success: true, data: orderByStatus });
    } catch (error) {
        console.error("SearchStatus Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const searchOrderBySale = async (req, res) => {
    try {
        const { status } = req.query;
        const query = { sale: req.user._id };

        if (status) {
            query.status = status;
        }

        const orderBySale = await orderModel.find(query)
            .populate('customer')
            .populate('sale');

        res.status(200).json({ success: true, data: orderBySale });
    } catch (error) {
        console.error("SearchOrderBySale Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getOrderNew = async (req, res) => {
    try {
        const getOrder = await orderModel.find().sort({ date: -1 }).limit(1);
        res.status(200).json({ success: true, data: getOrder });
    } catch (error) {
        console.error("GetOrderNew Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await orderModel.findById(id)
            .populate('customer')
            .populate({
                path: 'products.product',
                populate: { path: 'category' },
                select: '-image'
            })
            .populate('sale');

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({
            success: true,
            message: "Order Retrieved Successfully",
            data: order
        });
    } catch (error) {
        console.error("GetOrderById Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { estNo, customer, products, sale, date, status, comment } = req.body;

    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(id, {
            estNo,
            customer,
            products,
            sale,
            status,
            comment,
            date: date ? new Date(date) : Date.now()
        }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({
            success: true,
            message: "Order Updated Successfully",
            data: updatedOrder
        });
    } catch (error) {
        console.error("UpdateOrder Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await orderModel.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({
            success: true,
            message: "Order Deleted Successfully",
            data: deletedOrder
        });
    } catch (error) {
        console.error("DeleteOrder Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    searchStatus,
    createOrder,
    getAllOrders,
    getOrderNew,
    getOrderById,
    updateOrder,
    deleteOrder,
    searchByCustomer,
    searchOrderBySale
};