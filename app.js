const express = require("express")
const { users } = require("./model/index")
const app = express()
const bcrypt = require("bcryptjs")
app.set("view engine","ejs")

// database connection 
require("./model/index")

// parse incoming form data
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/register",(req,res)=>{
    res.redirect("login")
})

// post api for handling user registration

app.post("/register", async (req,res)=>{
    console.log(req.body)
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    // aako ko email ko kohi xa ki nae find garnu paryo 
const emailExist =    await users.findAll({
        where  : {
            email : email,
        }
    })
    if(emailExist.length > 0 ){
         res.send("User with that email already registered")
    }else{
         // validation from server side
    if(!email || !username || !password){
        return res.send("Please provide email,username,password")
    }

   await  users.create({
        email : email,
        username:username,
        password:bcrypt.hashSync(password,12)
    })
    res.send("User Registered Successfully")
    }

   

})
// login
app.get("./login",(req,res)=>{
    res.render("login")
})

app.post("/login",(req,res)=>{
    const email= req.body.email
    const password=req.body.password
    console.log(req.body)


// teo email vako user exist garcha ki gardaina
const userExists =users.findAll({
    where:{
        email:email
    }
})


console.log(userExists)
if(userExists.length > 0){
 const isMatch=   bcrypt.compareSync(password,userExists[0].password)  // password and hash password database ko lekko
console.log(isMatch)
if(isMatch){
    res.send("logged in successfully")

}else{
    res.send("invalid")
}
}else{
    res.send("invalid email or password")
}
})


app.listen(3000,function(){
    console.log("NodeJs project  started at port 3000")
})