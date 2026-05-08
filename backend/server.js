
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const ADMIN = {
  username: "admin",
  password: "admin123"
};

const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,"uploads");
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+"-"+file.originalname);
  }
});

const upload = multer({storage});

app.get("/",(req,res)=>{
  res.send("Backend Running");
});

app.post("/register",(req,res)=>{
  const users = JSON.parse(fs.readFileSync("users.json"));

  const exists = users.find(
    u=>u.username===req.body.username
  );

  if(exists){
    return res.json({message:"User already exists"});
  }

  users.push(req.body);

  fs.writeFileSync(
    "users.json",
    JSON.stringify(users,null,2)
  );

  res.json({message:"Registered Successfully"});
});

app.post("/login",(req,res)=>{
  const users = JSON.parse(fs.readFileSync("users.json"));

  const user = users.find(
    u=>u.username===req.body.username &&
    u.password===req.body.password
  );

  if(!user){
    return res.json({success:false});
  }

  res.json({success:true,user});
});

app.post("/admin-login",(req,res)=>{

  if(
    req.body.username===ADMIN.username &&
    req.body.password===ADMIN.password
  ){
    return res.json({success:true});
  }

  res.json({success:false});
});

app.get("/reviews",(req,res)=>{
  const reviews = JSON.parse(fs.readFileSync("reviews.json"));
  res.json(reviews);
});

app.post("/reviews",upload.single("image"),(req,res)=>{

  const reviews = JSON.parse(fs.readFileSync("reviews.json"));

  const newReview = {
    username:req.body.username,
    location:req.body.location,
    review:req.body.review,
    image:"/uploads/"+req.file.filename
  };

  reviews.push(newReview);

  fs.writeFileSync(
    "reviews.json",
    JSON.stringify(reviews,null,2)
  );

  res.json({message:"Posted Successfully"});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log("Server running on "+PORT);
});
