const express=require('express')

const app=express()

app.use("/hello",(req,res)=>{
    res.send("hello world from backend")
})
app.use("/first",(req,res)=>{
    res.send("this is my first route")
})
app.use("/",(req,res)=>{
    res.send("hello from dashboard")
})


app.listen(3000,()=>{
    console.log("this server is running on port 3000 sucessfully");
})