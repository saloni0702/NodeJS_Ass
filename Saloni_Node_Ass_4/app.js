const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const userModal = require("./userSchema");
const methodOverride = require("method-override");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));

const getClass= (isPromoted)=>{
	let className = "secondary";
	if(isPromoted){
		className = "primary";
	}
	else if(isPromoted !==null){
		className = "danger";
	}
	return className;
}

app.set("view engine","ejs");
app.listen(3000, (err)=>{
	if(err){
		console.log("Server Started at 3000");
	}
	else{
		console.log(err);	
	}
});

mongoose.connect("mongodb://localhost/assignment_4",()=>{
	console.log("Connected to databas");
},(err)=>{
	console.log(err);
});

app.get("/", (req,res)=>{
	userModal.find().then((user)=>{
		res.render("user",{user, getClass});	
	})	
});

app.post("/user/add",(req,res)=>{
	userModal.find({email:req.body.email}).then((userData)=>{
		if(userData.length){
			res.status(400).send("User Exist");
		}
		else{
			userModal.create({name:req.body.name, email:req.body.email, isPromoted: null}).then(()=>{
				res.redirect("/");
			}).catch((err)=>{
			console.log(err);
			})
		}
	})	
});

app.put("/user/update/:id",(req,res)=>{
	userModal.find({email: req.params.id}).then((userData)=>{
		userModal.updateOne({email: req.params.id},{isPromoted: !userData[0].isPromoted})
		.then(()=>{
			res.redirect("/");
		}).catch((err)=>{
			res.send(400).send(err)
		})
	})
});

app.delete("/user/delete/:id",(req,res)=>{
	userModal.deleteOne({email: req.params.id}).then(()=>{
		res.redirect("/");
	})
});

app.get("/form", (req,res)=>{
	res.render("user-form")
});
