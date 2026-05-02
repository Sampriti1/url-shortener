const express = require("express");

const cors = require("cors"); 
const path = require("path");

const { connectToMongoDB } = require("./connect");
const {checkForAuthentication, restrictTo} = require("./middlewares/auth")
const URL = require("./model/url");

const urlRoute = require("./routes/url");
const staticroute = require("./routes/staticRoute");
const analyticsRoute = require("./routes/analytics");
const userRoute = require("./routes/user");
const app = express();

const cookieParser = require("cookie-parser")
const PORT = process.env.PORT || 8001;

require("dotenv").config();
connectToMongoDB(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/short-url") 
  .then(() => console.log("MongoDb connected"));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(cookieParser());
 
app.use(express.json()); 
app.use(checkForAuthentication);
app.use(express.urlencoded({ extended: false}))


app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute); 
app.use("/user",checkForAuthentication, userRoute);
app.use("/analytics", restrictTo(["NORMAL", "ADMIN"]), analyticsRoute); 
app.use("/", restrictTo(["NORMAL", "ADMIN"]), staticroute);
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId; 
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
       
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
    { new: true }
  );
  
  res.redirect(entry.redirectURL);
});
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
