const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
  req.body.userId = req.user.id
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user cart
router.get('/:id', verifyTokenAndAuthorization, async (req, res)=>{
  try {
    const result = await Cart.find({userId: req.params.id})
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
})

// increment quantity of a product in the cart
router.put("/incrementQuantity/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
    const result = await Cart.findByIdAndUpdate(req.body.id, {$inc : {'quantity' : 1}})
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
})

// decrement 
router.put("/decrementQuantity/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
    const result = await Cart.findByIdAndUpdate(req.body.id, {$inc : {'quantity' : -1}})
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
})

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    // FIND THE CART ID FIRST THEN UPDATE
    const updatedCart = await Cart.findOneAndUpdate(
      {userId : req.params.id, productId: req.body.productId, color: req.body.color, size: req.body.size},
      {
        $set: req.body,
      },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const result = await Cart.deleteMany({userId: req.params.id})
    // await Cart.findOneAndDelete({userId: req.params.id});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// remove Single product from cart

router.delete("/removeFromCart/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
    const result = await Cart.findByIdAndDelete(req.body.id)
    res.status(203).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
})





// GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get total 
router.get( "/total/:id", verifyTokenAndAuthorization, async(req, res)=>{
  try {
    // get the products id 
    let result = Cart.find({userId: req.params.id})
    result = await result.select(["productId", "quantity"])
    var total = 0
    for(const element of result){
      const {price} = await Product.findById(element.productId)
      total += price*element.quantity
    }
    console.log("helllo")
    console.log(total)
    res.status(200).json({total})
  } catch (error) {
    console.log("errrr")
    res.status(500).json(error)
  }
})

module.exports = router;
