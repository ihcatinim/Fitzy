const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, variantId: { type: mongoose.Schema.Types.ObjectId, required: true }, name: { type: String, required: true }, image: { type: String, default: '' }, size: { type: String, required: true }, color: { type: String, required: true }, quantity: { type: Number, required: true, min: 1 }, unitPrice: { type: Number, required: true, min: 0 } });
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true }, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, items: { type: [orderItemSchema], required: true },
  shipping: { recipient: String, phone: String, line1: String, ward: String, district: String, city: String }, paymentMethod: { type: String, enum: ['cod', 'bank_transfer'], default: 'cod' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' }, subtotal: { type: Number, required: true }, discount: { type: Number, default: 0 }, shippingFee: { type: Number, default: 0 }, total: { type: Number, required: true }, promotionCode: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'], default: 'pending', index: true }, cancelledAt: Date
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
