const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const shortId = require('shortid');

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect("mongodb://localhost:27017/shortenUrlDB",{useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set("useCreateIndex",true);

const shortenUrlSchema = new mongoose.Schema({
   full:{
       type: String,
       required: true
   },
   short:{
       type: String,
       required: true,
       default: shortId.generate
   },
})

const ShortenUrl = new mongoose.model("ShortenUrl",shortenUrlSchema);


app.get("/",async (req,res)=>{
  const shrinkedUrls = await ShortenUrl.find();
  res.render('home',{shrinkedUrls: shrinkedUrls});
})

app.post("/",async (req,res)=>{
   await ShortenUrl.create({
       full: req.body.URL
   })
   res.redirect("/");
})

app.get("/:customName",async (req,res)=>{
   const shrinkedUrl = await ShortenUrl.findOne(
    {
        short: req.params.customName 
    }) 
    if(shrinkedUrl==null) return res.sendStatus(404);

    res.redirect(shrinkedUrl.full);
})


app.listen('3000',function(req,res){
    console.log("Server started on port 3000")
});