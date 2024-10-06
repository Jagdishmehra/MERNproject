const authentication=(req,res,next)=>{
    const token="1234"
    const valid="1234"===token
    if(!valid){
        res.status(401).send("not authorized")
    }
    else{
        next();
    }
}

module.exports={authentication,}