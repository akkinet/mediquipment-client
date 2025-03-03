import mongoose from "../lib/mongodb";

const OrderSchema = new mongoose.Schema({
  billing_address: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    postal_code: { type: String, required: true },
    state: { type: String, required: true }
  },
  
  comment: { type: String, default: "" },
  
  customer_email: { type: String, required: true },
  customer_name: { type: String, required: true },
  customer_phone: { type: String, required: true },
  
  discount_amount: { type: Number, default: 0.00 },
  
  insurance_company: { type: String },
  insurance_pdf: { type: String },
  
  items: [
    {
      description: { type: String, required: true },
      image: { type: String, required: true },
      prescription_file: { type: String, default: "" },
      prescription_required: { type: Boolean, required: true },
      price: { type: Number, required: true },
      product_id: { type: Number, required: true },
      product_name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  
  order_date: { type: String, required: true },
  order_status: { 
    type: String, 
    enum: ["Pending", "Processing", "Completed", "Cancelled"], 
    required: true 
  },
  
  prescription_required: { type: Boolean, default: false },
  prescription_status: { type: String, default: "" },
  
  shipping_address: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    postal_code: { type: String, required: true },
    state: { type: String, required: true }
  },
  
  shipping_amount: { type: Number, default: 0.00 },
  sub_amount: { type: Number, required: true },
  tax_amount: { type: Number, default: 0.00 },
  total_amount: { type: Number, required: true }
}, { timestamps: true });

// Check if the model has already been defined
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema, "Order");

export default Order;