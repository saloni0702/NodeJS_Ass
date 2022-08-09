const express = require("express"),
  app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

let userdata = [
    {
      name: 'abc',
      email: 'abc@gmail.com',
      age: 24,
      city: 'Mumbai',
      profession: 'Student'
    },
    {
      name: 'def',
      email: 'def@gmail.com',
      age: 18,
      city: 'Delhi',
      profession: 'Gamer'
    },
    {
      name: 'ghi',
      email: 'ghi@gmail.com',
      age: 25,
      city: 'Ahmedabad',
      profession: 'Teacher'
    },
    {
      name: 'jkl',
      email: 'jkl@gmail.com',
      age: 21,
      city: 'Gandhinagar',
      profession: 'Artist'
    },
    ];

app.get("/", function (req, res) {
  res.render("LandingPage",{userdata:userdata});
});

app.get("/UserAdd", function (req, res) {
  res.render("UserAdd");
});

app.post("/",function(req,res){
  let obj = {
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    city: req.body.city,
    profession: req.body.prof,
  };
  userdata.push(obj);
  res.redirect("/")
});

app.listen(3000, function () {
  console.log("Server is running on port 3000 ");
});