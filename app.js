const express =require("express");
const app=express();
const cors=require("cors");
require("dotenv").config();
require("./conn/conn")
const user=require("./routes/user");
const books=require("./routes/book")
const favourite=require("./routes/favourite")
const Cart=require("./routes/cart")
const Order=require("./routes/order")
app.use(cors());
app.use(express.json());



//Routes
app.use("/api/v1",user);
app.use("/api/v1",books);
app.use("/api/v1",favourite);
app.use("/api/v1",Cart);
app.use("/api/v1",Order);



//creating port
app.listen(process.env.PORT,()=>{
  console.log(`Server is running${process.env.PORT}`);
});