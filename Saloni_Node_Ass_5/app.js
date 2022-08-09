const express = require("express");
const mongoose = require("mongoose");
const signupModal = require("./modals/signup-modal");
const postModal = require("./modals/post-modal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const salt = 10;

const secretKey = '4a3798b4d9bfee259138ef4109479104abc4b5d795eef9d1ee492d5c1109f8e81974f37cc814aa232817a7fa8760f6397a83c2ed245a46a0fec3d1758b063107'

const app = express();
app.set("view engine","ejs");
app.listen(3000, (err)=>{
	if(!err){
		console.log("Server Started at 3000");
	}
	else{
		console.log(err);	
	}
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect("mongodb://localhost/assignment_5",()=>{
	console.log("Connected to database");
},(err)=>{
	console.log(err);
});

app.post("/register",(req,res)=>{
	signupModal.find({email:req.body.email}).then((userData)=>{
	if(userData.length){
		res.status(400).send("User exist. Please try with different email");
	}
	else{
		bcrypt.genSalt(salt).then((saltHash)=>{
			bcrypt.hash(req.body.password, saltHash).then((passwordHash)=>{
				signupModal.create({name: req.body.name, email: req.body.email, password:passwordHash}).then((user)=>{
					res.status(200).send({"status":"Success","data":user});
				})
				}).catch((err)=>{
					console.log(err);
			})
			}).catch((err)=>{
				console.log(err);
		})
	}

	})
});

app.post("/login",(req,res)=>{
	signupModal.find({email: req.body.email}).then((userData)=>{
		if(userData.length){
			//console.log(userData[0]._id)
			bcrypt.compare(req.body.password, userData[0].password).then((val)=>{
				if(val){
					const authToken = jwt.sign(userData[0].email, secretKey);
					res.status(200).send({"status":"Success","token":authToken});
				}
				else{
					res.status(400).send("Invalid Password");
				}
			})
		}
		else{
			res.status(400).send("Unauthorized user");
		}
	})
});

app.post("/posts",(req,res)=>{
	try{
        const email = jwt.verify(req.headers.authorization,secretKey)
        //console.log(id);
        signupModal.find({email:email}).then((userData)=>{
         if(userData.length){
             postModal.create({title:req.body.title,body:req.body.body,image:req.body.image,user:userData[0].email}).then((post)=>{
          		res.status(200).send({"status":"Post Created","data":{"body":post}})
             })
         }else{
             res.status(400).send("Unauthorized User")
         }
        })
    }catch(err){
        res.status(400).send("Unauthorized User yes")
    }
});

app.put("/posts/:_id",async(req,res)=>{
	try{
		let target  = await postModal.find(req.params);
		//console.log(req.params);
		if(target.length)
		{
			const email = jwt.verify(req.headers.authorization, secretKey)
			//console.log(target[0].user)
			//console.log(email)
			if(target[0].user === email){
				postModal.updateOne(req.params,{$set:req.body})
				res.status(200).send({"status":"Success"});
			}
			else{
				res.status(400).send("User ID is not matched");
			}
		}
		else{
			res.status(400).send("Post Id is not right");
		}
	}catch(err){
		res.status(400).send("Unauthorized User")
	}
});

app.delete("/posts/:_id",async(req,res)=>{
	try{
		let target  = await postModal.find(req.params);
		//console.log(req.params);
		if(target.length)
		{
			const email = jwt.verify(req.headers.authorization, secretKey)
			//console.log(target[0].user)
			//console.log(email)
			if(target[0].user === email){
				postModal.deleteOne(req.params)
				res.status(200).send({"status":"Successfully Deleted"});
			}
			else{
				res.status(400).send("User ID is not matched");
			}
		}
		else{
			res.status(400).send("Post Id is not right");
		}
	}catch(err){
		res.status(400).send("Unauthorized User")
	}
});
app.get("/", (req,res)=>{
	res.send("user");
});
