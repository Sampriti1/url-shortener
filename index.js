const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connect");
const {checkForAuthentication, restrictTo} = require("./middlewares/auth")
const URL = require("./model/url");

const urlRoute = require("./routes/url");
const staticroute = require("./routes/staticRoute");

const userRoute = require("./routes/user");
const app = express();

const cookieParser = require("cookie-parser")
const PORT = 8001;


connectToMongoDB("mongodb://127.0.0.1:27017/short-url") 
  .then(() => console.log("MongoDb connected"));

app.use(cookieParser());
app.use(express.static(__dirname));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views")); 
app.use(express.json()); //for parsing into json format
app.use(checkForAuthentication);
app.use(express.urlencoded({ extended: false}))// to convert json format to html form format


app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute); 
app.use("/user",checkForAuthentication, userRoute);
app.use("/", staticroute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId; 
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        //means pushing into array coz visitHistory is an array
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
    { new: true }
  );
  //now we need to redirect the user
  res.redirect(entry.redirectURL);
});
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
