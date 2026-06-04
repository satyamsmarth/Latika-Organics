const express = require("express");
const router = express.Router();

const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

/* GET WISHLIST */

router.get("/", auth, async (req,res)=>{

 const user = await User.findById(req.user.id).populate("wishlist");

 res.json(user.wishlist);

});

/* ADD TO WISHLIST */

router.post("/:productId", auth, async (req,res)=>{

 const user = await User.findById(req.user.id);

 if(!user.wishlist.includes(req.params.productId)){
  user.wishlist.push(req.params.productId);
 }

 await user.save();

 res.json(user.wishlist);

});

/* REMOVE FROM WISHLIST */

router.delete("/:productId", auth, async (req,res)=>{

 const user = await User.findById(req.user.id);

 user.wishlist = user.wishlist.filter(
  item=>item.toString() !== req.params.productId
 );

 await user.save();

 res.json(user.wishlist);

});

module.exports = router;