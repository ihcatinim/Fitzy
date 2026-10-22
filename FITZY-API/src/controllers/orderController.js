const Order = require('../models/Order');
const Review = require('../models/Review');
const orderService = require('../services/orderService');
const { asyncHandler, pageResult } = require('../utils/errors');

const create = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: { order: await orderService.createOrder(req.user.id, req.body) } }));
const mine = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1); const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const [items, total] = await Promise.all([Order.find({ user: req.user.id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Order.countDocuments({ user: req.user.id })]);
  res.json({ success: true, data: pageResult(items, total, page, limit) });
});
const detail = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user.id };
  const order = await Order.findOne(filter).populate('user', 'name email phone');
  if (!order) return res.status(404).json({ success: false, error: { message: 'Order not found' } });
  res.json({ success: true, data: { order } });
});
const cancel = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, error: { message: 'Order not found' } });
  res.json({ success: true, data: { order: await orderService.cancelOrder(order, req.user.id) } });
});
const markPaid = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndUpdate({ _id: req.params.id, paymentMethod: 'bank_transfer', paymentStatus: 'unpaid' }, { $set: { paymentStatus: 'paid' } }, { new: true });
  if (!order) return res.status(409).json({ success: false, error: { code: 'PAYMENT_NOT_UPDATABLE', message: 'Order is not an unpaid bank transfer' } });
  res.json({ success: true, data: { order } });
});
const markRefunded = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndUpdate({ _id: req.params.id, paymentMethod: 'bank_transfer', paymentStatus: 'paid' }, { $set: { paymentStatus: 'refunded' } }, { new: true });
  if (!order) return res.status(409).json({ success: false, error: { code: 'REFUND_NOT_UPDATABLE', message: 'Order is not a paid bank transfer' } });
  res.json({ success: true, data: { order } });
});
const createReview = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.body.orderId, user: req.user.id, status: 'completed', 'items.product': req.params.productId });
  if (!order) return res.status(403).json({ success: false, error: { message: 'Only buyers with a completed order can review this product' } });
  const review = await Review.create({ product: req.params.productId, user: req.user.id, order: order._id, rating: req.body.rating, comment: req.body.comment || '' });
  res.status(201).json({ success: true, data: { review } });
});

module.exports = { create, mine, detail, cancel, markPaid, markRefunded, createReview };
