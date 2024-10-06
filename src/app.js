const express=require('express')
const {connectdb}  = require('./config/Database')
const {UserModel}=require('./models/Schema')
const { model, Model } = require('mongoose')
const app=express()

// we will use a middleware to convert our data into js object
app.use(express.json())
// posting data to db
app.post("/signup",async (req,res)=>{
 //step-1 to get dynamic data from the end user
   //console.log(req.body) // we can directly use it in new user as it is giving us an object already
    const user=new UserModel(req.body)
   try{
    await user.save()
    res.send("user added succesfully 1")
   }
   catch(err){
    res.status(400).send("err occured")
   }
})
// now we need to get all the data from the db to show it in feed
app.get("/feed", async (req,res)=>{
    try{     
        const users= await UserModel.find({})
        if(users.length)
            {res.send(users)}
            else 
            {res.send("user not found")  }  
       }
       catch(err){
        res.status(400).send("something went wrong")
       }

})
// deleting a user from the db
app.delete("/user", async(req,res)=>{
    const id=req.body.id
    try{
        const user=await UserModel.findOneAndDelete(id)
        res.send("user deleted");
    }
    catch(err){
        res.status(400).send("something went wrong")
       }

})
// updating a user info
app.patch("/user",async(req,res)=>{
    const id=req.body.id
    const data=req.body
    try{
        const newdata=await UserModel.findByIdAndUpdate(id,data)
        console.log(newdata);
        res.send("user updated")
    }
    catch(err){
        res.status(400).send("something went wrong")
       }
})
connectdb().then(()=>{
    console.log('db connected succesfully')
    app.listen(3000,()=>{
        console.log("this server is running on port 3000 sucessfully");
    })}
)
.catch((err)=>{
    console.log("error occured during connection",err)
})