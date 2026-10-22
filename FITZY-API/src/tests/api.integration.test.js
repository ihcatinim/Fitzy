const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

process.env.JWT_SECRET = 'integration-test-secret-that-is-long-enough';
process.env.CLIENT_ORIGINS = 'http://localhost:5173';
process.env.GEMINI_API_KEY = '';
process.env.BANK_TRANSFER_BANK_NAME = 'Test Bank';
process.env.BANK_TRANSFER_ACCOUNT_NAME = 'FITZY TEST';
process.env.BANK_TRANSFER_ACCOUNT_NUMBER = '1234567890';
let replicaSet; let app; let customerToken; let product; let variant; let adminUser; let placedOrder;
const { syncFirebaseUser } = require('../services/authService');

test.before(async () => {
  replicaSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(replicaSet.getUri());
  app = require('../app');
  const User = require('../models/User'); const Category = require('../models/Category'); const Product = require('../models/Product'); const Promotion = require('../models/Promotion');
  adminUser = await User.create({ name: 'Test Admin', email: 'admin@test.fitzy', passwordHash: 'not-a-login-hash', role: 'admin' });
  const category = await Category.create({ name: 'Test shirts', slug: 'test-shirts' });
  product = await Product.create({ name: 'Test T-shirt', slug: 'test-shirt', category: category._id, price: 100000, status: 'active', variants: [{ size: 'M', color: 'Black', quantity: 5 }] });
  variant = product.variants[0];
  await Promotion.create({ code: 'SAVE10', discountType: 'percent', discountValue: 10, minimumOrder: 0, startsAt: new Date(Date.now() - 60000), endsAt: new Date(Date.now() + 3600000), active: true });
});

test.after(async () => { await mongoose.disconnect(); await replicaSet?.stop(); });

test('auth validates registration, login, and rejects invalid credentials', async () => {
  const registered = await request(app).post('/api/auth/register').send({ name: 'Test Buyer', email: 'buyer@test.fitzy', password: 'secure-pass-123' });
  assert.equal(registered.status, 201);
  assert.equal(typeof registered.body.data.token, 'string');
  assert.equal(registered.body.data.user.passwordHash, undefined);
  customerToken = registered.body.data.token;
  const login = await request(app).post('/api/auth/login').send({ email: 'buyer@test.fitzy', password: 'secure-pass-123' });
  assert.equal(login.status, 200);
  assert.equal((await request(app).post('/api/auth/login').send({ email: 'buyer@test.fitzy', password: 'wrong-password' })).status, 401);
});

test('Firebase sync creates a customer profile once and does not expose Firebase identifiers', async () => {
  const claims = { uid: 'firebase-new-customer', email: 'firebase-buyer@test.fitzy', email_verified: false, name: 'Firebase Buyer' };
  const first = await syncFirebaseUser(claims);
  const repeated = await syncFirebaseUser(claims);
  assert.equal(first.id, repeated.id);
  assert.equal(first.role, 'customer');
  assert.equal(first.email, claims.email);
  assert.equal(first.toJSON().firebaseUid, undefined);
  assert.equal(first.toJSON().passwordHash, undefined);
  assert.equal(await mongoose.model('User').countDocuments({ email: claims.email }), 1);
});

test('Firebase sync links a verified existing admin without changing its role', async () => {
  await syncFirebaseUser({ uid: 'firebase-existing-admin', email: adminUser.email, email_verified: true }, 'Linked Admin');
  const linked = await mongoose.model('User').findById(adminUser.id).select('+firebaseUid +passwordHash');
  assert.equal(linked.firebaseUid, 'firebase-existing-admin');
  assert.equal(linked.role, 'admin');
  assert.equal(linked.passwordHash, 'not-a-login-hash');
});

test('Firebase sync requires verified email before linking and rejects conflicting identities', async () => {
  const User = mongoose.model('User');
  const legacy = await User.create({ name: 'Legacy Buyer', email: 'legacy-buyer@test.fitzy', passwordHash: 'legacy-hash', role: 'customer' });
  await assert.rejects(
    syncFirebaseUser({ uid: 'firebase-unverified-legacy', email: legacy.email, email_verified: false }),
    error => error.code === 'EMAIL_VERIFICATION_REQUIRED'
  );
  const untouched = await User.findById(legacy.id).select('+firebaseUid');
  assert.equal(untouched.firebaseUid, undefined);
  await assert.rejects(
    syncFirebaseUser({ uid: 'firebase-other-admin', email: adminUser.email, email_verified: true }),
    error => error.code === 'FIREBASE_ACCOUNT_CONFLICT'
  );
});

test('product listing is public, filterable, and paginated', async () => {
  const result = await request(app).get('/api/products?size=M&page=1&limit=5');
  assert.equal(result.status, 200);
  assert.equal(result.body.data.items[0].slug, 'test-shirt');
  assert.equal(result.body.data.pagination.total, 1);
});

test('stylist fallback returns only in-stock database products and requires a session', async () => {
  const response = await request(app).post('/api/ai/stylist').set('Authorization', `Bearer ${customerToken}`).send({ occasion: 'casual', style: 'minimal', colors: 'Black', size: 'M', budget: 150000 });
  assert.equal(response.status, 200);
  assert.equal(response.body.data.usedFallback, true);
  assert.ok(response.body.data.products.some(item => item._id === product.id));
  const denied = await request(app).post('/api/ai/stylist').send({ style: 'casual' });
  assert.equal(denied.status, 401);
});

test('customers cannot access admin endpoints', async () => {
  assert.equal((await request(app).get('/api/admin/products')).status, 401);
  const denied = await request(app).get('/api/admin/products').set('Authorization', `Bearer ${customerToken}`);
  assert.equal(denied.status, 403);
});

test('promotions are calculated on server and order creation reserves inventory', async () => {
  const check = await request(app).post('/api/promotions/check').set('Authorization', `Bearer ${customerToken}`).send({ code: 'SAVE10', items: [{ productId: product.id, variantId: variant.id, quantity: 1 }] });
  assert.equal(check.status, 200);
  assert.equal(check.body.data.discount, 10000);
  const placed = await request(app).post('/api/orders').set('Authorization', `Bearer ${customerToken}`).send({
    items: [{ productId: product.id, variantId: variant.id, quantity: 1, unitPrice: 1 }], promotionCode: 'SAVE10', paymentMethod: 'cod', total: 1,
    shipping: { recipient: 'Test Buyer', phone: '0912345678', line1: '12 Test Street', district: 'District 1', city: 'Ho Chi Minh City' }
  });
  assert.equal(placed.status, 201);
  assert.equal(placed.body.data.order.subtotal, 100000);
  assert.equal(placed.body.data.order.total, 120000);
  placedOrder = placed.body.data.order;
  const refreshed = await mongoose.model('Product').findById(product.id);
  assert.equal(refreshed.variants.id(variant.id).quantity, 4);
  const overstock = await request(app).post('/api/orders').set('Authorization', `Bearer ${customerToken}`).send({ items: [{ productId: product.id, variantId: variant.id, quantity: 5 }], shipping: { recipient: 'Test Buyer', phone: '0912345678', line1: '12 Test Street', district: 'District 1', city: 'Ho Chi Minh City' } });
  assert.equal(overstock.status, 409);
});

test('order ownership is enforced and cancellation restores stock', async () => {
  const other = await request(app).post('/api/auth/register').send({ name: 'Other Buyer', email: 'other@test.fitzy', password: 'secure-pass-456' });
  const otherToken = other.body.data.token;
  const placed = await request(app).post('/api/orders').set('Authorization', `Bearer ${customerToken}`).send({ items: [{ productId: product.id, variantId: variant.id, quantity: 1 }], shipping: { recipient: 'Test Buyer', phone: '0912345678', line1: '12 Test Street', district: 'District 1', city: 'Ho Chi Minh City' } });
  assert.equal(placed.status, 201);
  const forbiddenRead = await request(app).get(`/api/orders/${placed.body.data.order._id}`).set('Authorization', `Bearer ${otherToken}`);
  assert.equal(forbiddenRead.status, 404);
  const cancelled = await request(app).post(`/api/orders/${placed.body.data.order._id}/cancel`).set('Authorization', `Bearer ${customerToken}`);
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.body.data.order.status, 'cancelled');
  const refreshed = await mongoose.model('Product').findById(product.id);
  assert.equal(refreshed.variants.id(variant.id).quantity, 4);
});

test('bank transfer is listed when configured and can be confirmed by an admin', async () => {
  const methods = await request(app).get('/api/payments/methods');
  assert.equal(methods.status, 200);
  assert.deepEqual(methods.body.data.methods.map(method => method.id), ['cod', 'bank_transfer']);
  assert.equal(methods.body.data.methods[1].bankAccount.accountNumber, '1234567890');
  const placed = await request(app).post('/api/orders').set('Authorization', `Bearer ${customerToken}`).send({
    items: [{ productId: product.id, variantId: variant.id, quantity: 1 }], paymentMethod: 'bank_transfer',
    shipping: { recipient: 'Test Buyer', phone: '0912345678', line1: '12 Test Street', district: 'District 1', city: 'Ho Chi Minh City' }
  });
  assert.equal(placed.status, 201);
  assert.equal(placed.body.data.order.paymentMethod, 'bank_transfer');
  assert.equal(placed.body.data.order.paymentStatus, 'unpaid');
  const adminToken = require('jsonwebtoken').sign({ sub: adminUser.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  assert.equal((await request(app).patch(`/api/orders/${placed.body.data.order._id}/payment/confirm`).set('Authorization', `Bearer ${customerToken}`)).status, 403);
  const confirmed = await request(app).patch(`/api/orders/${placed.body.data.order._id}/payment/confirm`).set('Authorization', `Bearer ${adminToken}`);
  assert.equal(confirmed.status, 200);
  assert.equal(confirmed.body.data.order.paymentStatus, 'paid');
  assert.equal((await request(app).patch(`/api/orders/${placed.body.data.order._id}/payment/confirm`).set('Authorization', `Bearer ${adminToken}`)).status, 409);
  assert.equal((await request(app).post(`/api/orders/${placed.body.data.order._id}/cancel`).set('Authorization', `Bearer ${customerToken}`)).status, 409);
  const refunded = await request(app).patch(`/api/orders/${placed.body.data.order._id}/payment/refund`).set('Authorization', `Bearer ${adminToken}`);
  assert.equal(refunded.status, 200);
  assert.equal(refunded.body.data.order.paymentStatus, 'refunded');
  const cancelled = await request(app).post(`/api/orders/${placed.body.data.order._id}/cancel`).set('Authorization', `Bearer ${customerToken}`);
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.body.data.order.status, 'cancelled');
});

test('only valid order transitions complete sales and permit verified reviews', async () => {
  const adminToken = require('jsonwebtoken').sign({ sub: adminUser.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const skip = await request(app).patch(`/api/orders/${placedOrder._id}/status`).set('Authorization', `Bearer ${adminToken}`).send({ status: 'shipping' });
  assert.equal(skip.status, 409);
  const beforeCompletion = await request(app).post(`/api/products/${product.id}/reviews`).set('Authorization', `Bearer ${customerToken}`).send({ orderId: placedOrder._id, rating: 5, comment: 'Good fit' });
  assert.equal(beforeCompletion.status, 403);
  for (const status of ['confirmed', 'shipping', 'completed']) {
    const transition = await request(app).patch(`/api/orders/${placedOrder._id}/status`).set('Authorization', `Bearer ${adminToken}`).send({ status });
    assert.equal(transition.status, 200);
  }
  const completed = await mongoose.model('Order').findById(placedOrder._id);
  assert.equal(completed.paymentStatus, 'paid');
  const validReview = await request(app).post(`/api/products/${product.id}/reviews`).set('Authorization', `Bearer ${customerToken}`).send({ orderId: placedOrder._id, rating: 5, comment: 'Good fit' });
  assert.equal(validReview.status, 201);
  const reviewId = validReview.body.data.review._id;
  const edited = await request(app).patch(`/api/reviews/${reviewId}`).set('Authorization', `Bearer ${customerToken}`).send({ rating: 4, comment: 'Still good' });
  assert.equal(edited.status, 200);
  const stats = await request(app).get('/api/stats').set('Authorization', `Bearer ${adminToken}`);
  assert.equal(stats.body.data.revenue, 120000);
  const refreshed = await mongoose.model('Product').findById(product.id);
  assert.equal(refreshed.salesCount, 1);
});
