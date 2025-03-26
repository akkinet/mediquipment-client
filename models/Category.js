import mongoose from "../lib/mongodb";

const categorySchema = new mongoose.Schema({
  name: String,
  image: String
}, {
  collection: "RealCategory"
})

const Category = mongoose.models.RealCategory || mongoose.model("RealCategory", categorySchema);
export default Category;