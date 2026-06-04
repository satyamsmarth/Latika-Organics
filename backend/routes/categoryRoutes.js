const express = require("express");
const router = express.Router();
const Category = require("../models/Category");


/* GET ALL CATEGORIES */

router.get("/", async (req,res)=>{

 try{

  const categories = await Category.find().sort({name:1});

  res.json(categories);

 }catch(err){

  res.status(500).json({message:err.message});

 }

});


/* ADD CATEGORY */

router.post("/", async (req,res)=>{

 try{

  const category = new Category({
   name:req.body.name
  });

  const saved = await category.save();

  res.json(saved);

 }catch(err){

  res.status(500).json({message:err.message});

 }

});


/* DELETE CATEGORY */

router.delete("/:id", async (req,res)=>{

 try{

  await Category.findByIdAndDelete(req.params.id);

  res.json({message:"Category deleted"});

 }catch(err){

  res.status(500).json({message:err.message});

 }

});


module.exports = router;