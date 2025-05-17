const router =require("express").Router();
const User=require("../models/user");
const {authenticateToken}=require("./userAuth");
const Book=require("../models/books");
const Order=require("../models/order");


//place order
router.post('/place-order',authenticateToken,async(req,res)=>{
  try {
    const {id}=req.headers;
    const {order}=req.body;
    for(const orderData of order){
      const newOrder=new Order({
        user:id,
        book:orderData._id
      });
      const orderDataFromDB=await newOrder.save();
      //saving order data in user model
      await User.findByIdAndUpdate(id,{$push:{orders:orderDataFromDB._id}});
      //clearing cart
      await User.findByIdAndUpdate(id,{$pull:{cart:orderData._id}});
    }
    return res.json({
      status:"Scucess",
      message:"Oder Placed SucessFully"
    });
    
  } catch (error) {
    return res.status(400).json({
      message:error.message
    });
  }
});

//get order history of a paticular user
router.get("/get-order-history",authenticateToken,async(req,res)=>{
  try {
    const { id }=req.headers;
    const userData=await User.findById(id).populate({
      path:"orders",
      populate:{path:"book"}
    });

    const ordersData=userData.orders.reverse();
    return res.json({
      status:"Success",
      data:ordersData
    });
    
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
});

//get all order --admin
router.get("/get-allorder-history",authenticateToken,async(req,res)=>{
  try {
    const userData=await Order.find()
    .populate({
      path:"book",
    })
    .populate({
      path:"user",
    }).sort({createdAt:-1});
    return res.json({
      status:"okiee",
      data:userData
    });
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
});
//update order --admin
router.put("/update-status/:id",authenticateToken,async(req,res)=>{
  try {
    const {id}=req.params;
    await Order.findByIdAndUpdate(id,{status:req.body.status});
    return res.json({
      status:"Sucess",
      message:"Status updated scuessfully"
    });
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
})

module.exports=router;