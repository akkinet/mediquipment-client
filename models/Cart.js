import mongoose from '../lib/mongodb';
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    description: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    price: { type: Number, required: true },
    product_id: { type: Number, required: true, unique: true },
    quantity: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    title: { type: String, required: true }
});

const cartSchema = new Schema({
    email: { type: String, required: true, unique: true },
    items: [itemSchema] // Embedded subdocument array of items
});

const Cart = mongoose.model('Cart', cartSchema, "Cart");

export default Cart;