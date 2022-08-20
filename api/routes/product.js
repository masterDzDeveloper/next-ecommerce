const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  let {fields} = req.query
  try {
    let product = Product.findById(req.params.id);
    if(fields){
      fields = fields.split(",").join(" ")
      product = await product.select(fields)
    }else{
      product = await product
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qSort = req.query.sort;
  const qSize = req.query.size;
  const qColor = req.query.color;
  const qCategory = req.query.category;
  const qFields = req.query.fields;

  const queryObject = {}

  if(qSize){
    queryObject.size = qSize
  }
  if(qColor){
    queryObject.color = qColor
  }
  if(qCategory){
    queryObject.categories = qCategory
  }

  try {
    let products;
    
    // Applaying filters
    products = Product.find(queryObject)

    // Sort
    if (qSort === "Newest") {
      products = products.sort({updatedAt : -1})
    }else if(qSort === "Price(asc)"){
      products = products.sort({price: 1})
    }else if(qSort === "Price(desc)"){
      products = products.sort({price: -1})
    }

    // Fields 
    if(qFields){
      const fields = qFields.split(",").join(" ")
      products = products.select(fields)
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    products = products.skip(skip).limit(limit);

    products = await products
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
