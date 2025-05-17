const router =require("express").Router();
const User=require("../models/user");
const {authenticateToken}=require("./userAuth");

//add book to favourite
router.put("/add-book-favourite",authenticateToken,async(req,res)=>{
try {
  const {bookid,id}=req.headers;
  const userData=await User.findById(id);
  const isBookFavourite=userData.favorites.includes(bookid);
  if(isBookFavourite){
    return res.status(200).json({message:"book is already in favourite"});
  }
  await User.findByIdAndUpdate(id,{$push:{favorites:bookid}});
  return res.status(200).json({message:"book is added to favourites"});
} catch (error) {
  return res.status(400).json({message:error.message});
}
});

//remove book from favourite
router.put("/remove-book-favourite",authenticateToken,async(req,res)=>{
  try {
    const {bookid,id}=req.headers;
    const userData=await User.findById(id);
    const isBookFavourite=userData.favorites.includes(bookid);
    if(isBookFavourite){
      await User.findByIdAndUpdate(id,{$pull:{favorites:bookid}});
    }
    
    return res.status(200).json({message:"book is removed to favourites"});
  } catch (error) {
    return res.status(400).json({message:error.message});
  }
  });
//get favourite books of particular user  

router.get("/get-favourite-books",authenticateToken,async(req,res)=>{
  try {
    const {id}=req.headers;
    const userData=await User.findById(id).populate("favorites");
    const favoritesBooks=userData.favorites;
    return res.json({
      status:"Scuccess",
      data:favoritesBooks
    })
  } catch (error) {
    return res.status(400).json({message:error.message});
  }
});  
module.exports=router;