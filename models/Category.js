import mongoose from "../lib/mongodb";

const categorySchema = new mongoose.Schema({
  name: String,
  image: String
}, {
  collection: "Categories"
})

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;