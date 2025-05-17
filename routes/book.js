const router=require("express").Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken");
const Book=require("../models/books");
const {authenticateToken}=require("./userAuth");


//add book --admin
router.post("/add-book",authenticateToken,async (req,res)=>{
  try {
    const {id} =req.headers;
    const user=await User.findById(id);
    if(user.role!=="admin"){
      res.status(400).json({message:"You are not having access to perform admin work"})
    }

    const book=new Book({
      url:req.body.url,
      title:req.body.title,
      author:req.body.author,
      price:req.body.price,
      desc:req.body.desc,
      language:req.body.language
    });
    await book.save();
    return res.status(200).json({message:"Book added sucessfully"});
    
  } catch (error) {
    res.status(400).json({message:error.message})
  }
});

//update book --admin
router.put("/update-book",authenticateToken,async(req,res)=>{
  try {
    const {bookid}=req.headers;
    await Book.findByIdAndUpdate(bookid,{
      url:req.body.url,
      title:req.body.title,
      author:req.body.author,
      price:req.body.price,
      desc:req.body.desc,
      language:req.body.language
    });
    return res.status(200).json({message:"book updated sucessfully"});
    
  } catch (error) {
    return res.status(400).json({message:error.message});
  }
});
//delete book --admin
router.delete("/delete-book",authenticateToken,async(req,res)=>{
  try {
    const {bookid}=req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({message:"book deleted successfully"});
    
  } catch (error) {
    return res.status(400).json({message:error.message});
  }
});
// get all book
router.get("/get-all-books",async(req,res)=>{
  try {
    const books=await Book.find().sort({createdAt:-1});
    return res.json({
      status:"sucess",
      data:books
    });
    
  } catch (error) {
    return res.status(400).json({message:error.message});
  }
});
// get recently added book limit 400
router.get("/get-recent-books",async(req,res)=>{
  try {
    const books=await Book.find().sort({createdAt:-1}).limit(4);
    return res.json({
      status:"sucess",
      data:books
    });
    
  } catch (error) {
    return res.status(400).json({message:error.message});
  }
});
// get book detail by id
router.get("/get-book-by-id/:id",async(req,res)=>{
  try {
    const {id} =req.params;
    const book=await Book.findById(id);
    return res.json({
      status:"sucess",
      data:book
    });
  } catch (error) {
    return res.status(400).json({message:error.message});
  }
})

module.exports=router;