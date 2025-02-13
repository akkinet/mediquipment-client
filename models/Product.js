import mongoose from "../lib/mongodb";

const ProductSchema = new mongoose.Schema({
  stockQuantity: { type: Number, required: true },
  brand_name: { type: String, required: true },
  prod_detailed_desc: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],
  prod_id: { type: String, required: true, unique: true },
  isFeatured: { type: Boolean, default: false },
  prod_value: { type: String, required: true },
  prod_highlight: { type: [String], required: true },
  prod_name: { type: String, required: true },
  category: { type: String, required: true },
  key_features: {
    pay_over_time: { type: Boolean, default: false },
    rx_required: { type: Boolean, default: false },
    light_weight: { type: Boolean, default: false },
    "2_years_warranty": { type: Boolean, default: false },
    free_shipping: { type: Boolean, default: false }
  },
  prod_desc: { type: String, required: true },
  parcel: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    weight: { type: Number, required: true },
    distance_unit: { type: String, required: true },
    height: { type: Number, required: true },
    mass_unit: { type: String, required: true }
  },
  vendor_name: { type: String, required: true },
  prod_images: { type: [String], required: true }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'Products');
export default Product;