const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connect");
const {restricToLoggedinUserOnly, checkAuth} = require("./middlewares/auth")
const URL = require("./model/url");

const urlRoute = require("./routes/url");
const staticroute = require("./routes/staticRoute");

const userRoute = require("./routes/user");
const app = express();



const cookieParser = require("cookie-parser")
const PORT = 8001;
//const router = require("./routes/url");

connectToMongoDB("mongodb://127.0.0.1:27017/short-url") //here short-url is the name of the database
  .then(() => console.log("MongoDb connected"));
//ejs engine usage(for creating template for server side rendering)
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.resolve("./views")); //means that all the files of ejs are in the views folder
app.use(express.json()); //for parsing into json format

app.use(express.urlencoded({ extended: false}))// to convert json format to html form format


app.use("/url", restricToLoggedinUserOnly, urlRoute); //coz we want that for the user to do anything on the /url route he/she must always be logged in
app.use("/user",checkAuth, userRoute);
app.use("/", staticroute);
//server side rendering
//app.get("/test", async (req, res) => {
  //const allUrls = await URL.find({});
  //instead of writing the whole html here we can just render the file of ejs here directly
  //return res.render("home");
    
  //}); //rendering the file named home
   //we can also pass and rendervariables here of index.js like allUrls

   

  
  /*return res.end(`
      <html>
      <head>
      </head>
      <body>
      <ol>
      ${allUrls.map(url => `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}</li>`).join('')}
</ol>
</body>
</html>
      `)*/
  //now we need not write this html as we rendered it through ejs; //but in production we cannot write html like this for server side rendering as it will be messed up
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId; //means the parameter i.e., the short url jo user ne mujhe diya hein
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
