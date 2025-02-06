const mongoose = require("mongoose")
const urlSchema = new mongoose.Schema({
 shortId:{
  type:String,
  required:true,
  unique: true
 },
 redirectURL:{
   type: String,
   required:true
 },
 visitHistory:[{ //visitHistory will be an array of objects
    timestamp:{
        type: Number// so that we can see at what time it was clicked
    }
 }],


 
 createdBy:{ //the user who entered the url to be shortened
  type: mongoose.Schema.Types.ObjectId,
  ref: "users",
 },
},
 {timestamps: true} //remember its timestamps and not timestamp of visitHistory

);
const URL = mongoose.model("url", urlSchema);
module.exports = URL;
   