const router =require("express").Router();
const User=require("../models/user");
const {authenticateToken}=require("./userAuth");

//put book to cart
router.put("/add-to-cart",authenticateToken,async(req,res)=>{
  try {
    const {bookid,id}=req.headers;
    const userData=await User.findById(id);
    const isBookinCart=userData.cart.includes(bookid);
    if(isBookinCart){
      return res.json({
        status:"Scucess",
        message:"Book is already in the cart"
      });
    }
    await User.findByIdAndUpdate(id,{$push:{cart:bookid}});
    return res.json({
      status:"Scucess",
      message:"Book is added to cart"
    });
  } catch (error) {
    return res.status(400).json({message:error.message});
  }
});

//remove book from cart
router.put("/remove-from-cart/:bookid",authenticateToken,async(req,res)=>{
  try {
    const {bookid}=req.params;
    const {id}=req.headers;
    const userData=await User.findById(id);
    const isBookinCart=userData.cart.includes(bookid);
    if(isBookinCart){
      await User.findByIdAndUpdate(id,{$pull:{cart:bookid}});
    }
    
    return res.json({
      status:"Scucess",
      message:"Book is removed from cart"
    });
  } catch (error) {
    return res.status(400).json({message:error.message});
  }
});

//get a cart of particular cart
router.get("/get-user-cart",authenticateToken,async(req,res)=>{
  try {
    const {id}=req.headers;
    const userData=await User.findById(id).populate("cart");
    const cart=userData.cart.reverse();
    return res.json({
      status:"Scuccess",
      data:cart
    })
  } catch (error) {
    return res.status(400).json({message:error.message});
  }
});  

module.exports=router;