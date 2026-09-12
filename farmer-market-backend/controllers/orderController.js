const Order = require('../models/Order');
const Crop = require('../models/Crop');

// @desc    Create direct purchase order
// @route   POST /api/orders/direct
// @access  Private (Buyer)
exports.createDirectOrder = async (req, res) => {
  try {
    const { cropId, quantity, shippingAddress, paymentMethod } = req.body;

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.quantity < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Only ${crop.quantity} ${crop.unit} available in stock`,
      });
    }

    const pricePerUnit = crop.pricePerUnit;
    const totalAmount = pricePerUnit * Number(quantity);

    const order = await Order.create({
      crop: cropId,
      buyer: req.user._id,
      farmer: crop.farmer,
      quantity: Number(quantity),
      unit: crop.unit,
      pricePerUnit,
      totalAmount,
      orderStatus: 'confirmed',
      paymentStatus: 'in_escrow',
      paymentMethod: paymentMethod || 'Escrow',
      shippingAddress: shippingAddress || req.user.location,
      timeline: [
        { status: 'placed', note: 'Direct order placed by buyer', timestamp: new Date() },
        { status: 'confirmed', note: 'Payment secured in KisanSetu Escrow', timestamp: new Date() },
      ],
    });

    // Reduce crop quantity
    const remaining = crop.quantity - Number(quantity);
    await Crop.findByIdAndUpdate(cropId, {
      quantity: remaining,
      status: remaining === 0 ? 'sold' : 'available',
    });

    res.status(201).json({
      success: true,
      message: 'Direct order created successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders for current user
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'buyer') {
      query.buyer = req.user._id;
    } else if (req.user.role === 'farmer') {
      query.farmer = req.user._id;
    }

    const orders = await Order.find(query)
      .populate('crop', 'cropName category pricePerUnit unit images location')
      .populate('farmer', 'name phone email businessName location')
      .populate('buyer', 'name phone email businessName location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('crop')
      .populate('farmer', 'name phone email businessName location rating')
      .populate('buyer', 'name phone email businessName location rating');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, note } = req.body;
    const validStatuses = ['placed', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'delivered' || orderStatus === 'completed') {
      order.paymentStatus = 'released_to_farmer';
    }

    order.timeline.push({
      status: orderStatus,
      note: note || `Order updated to ${orderStatus}`,
      timestamp: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order marked as ${orderStatus}`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
