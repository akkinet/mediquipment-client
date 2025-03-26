import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  stockQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  brand_name: {
    type: String,
    required: true,
    trim: true
  },
  prod_detailed_desc: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  prod_id: {
    type: String,
    required: true,
    unique: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  prod_highlight: [{
    type: String,
    trim: true
  }],
  prod_name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  key_features: {
    pay_over_time: { type: Boolean, default: false },
    rx_required: { type: Boolean, default: false },
    light_weight: { type: Boolean, default: false },
    two_years_warranty: { type: Boolean, default: false }, 
    free_shipping: { type: Boolean, default: false }
  },
  prod_desc: {
    type: String,
    required: true,
    trim: true
  },
  parcel: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    weight: { type: Number, required: true },
    distance_unit: { type: String, enum: ['in', 'cm'], default: 'in' },
    height: { type: Number, required: true },
    mass_unit: { type: String, enum: ['lb', 'kg'], default: 'lb' }
  },
  vendor_name: {
    type: String,
    required: true,
    trim: true
  },
  prod_images: [{
    type: String,
    trim: true
  }],
  // price: {
  //   MSRP: { type: Number, required: true },        // Manufacturer's Suggested Retail Price
  //   OurCost: { type: Number, required: true },     // Cost to us
  //   MAP: { type: Number, required: true },         // Minimum Advertised Price
  //   OurSalesPrice: { type: Number, default: null } // Our selling price (can be null)
  // }
  prod_value: { type: Number, required: true },
  actual_price: { type: Number, required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for discount calculation
ProductSchema.virtual('discount').get(function () {
  const msrp = this.price.actual_price;
  // const effectivePrice = this.price.OurSalesPrice !== null ? this.price.OurSalesPrice : this.price.MAP;
  const effectivePrice = this.price.prod_value;
  
  if (!msrp || !effectivePrice || msrp <= effectivePrice) {
    return 0; 
  }

  const discount = ((msrp - effectivePrice) / msrp) * 100;
  return Number(discount.toFixed(2)); 
});

const RealProduct = mongoose.model('RealProduct', ProductSchema);

export default RealProduct;