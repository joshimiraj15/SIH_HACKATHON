const Order = require('../models/Order');

exports.getOrders = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role === 'farmer') {
            query.farmerId = req.user._id;
        } else if (req.user.role === 'buyer') {
            query.buyerId = req.user._id;
        } else if (req.user.role === 'admin') {
            query = {};
        }

        const orders = await Order.find(query)
            .populate('cropId', 'cropName unit location')
            .populate('farmerId', 'name email phone location')
            .populate('buyerId', 'name email phone location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('cropId', 'cropName unit location')
            .populate('farmerId', 'name email phone location')
            .populate('buyerId', 'name email phone location');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
                error: 'Not Found'
            });
        }

        if (
            order.farmerId._id.toString() !== req.user._id.toString() &&
            order.buyerId._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order',
                error: 'Forbidden'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order details retrieved',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Status must be one of: ${validStatuses.join(', ')}`,
                error: 'Bad Request'
            });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
                error: 'Not Found'
            });
        }

        if (
            order.farmerId.toString() !== req.user._id.toString() &&
            order.buyerId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this order status',
                error: 'Forbidden'
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};
