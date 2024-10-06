
// first we have to make a schema (install mongoose an odm lib for mongo db)
// then we have to export the schema model
// use it to configure data in our app.
const mongoose=require('mongoose')

const connectdb=async ()=>{
   await mongoose.connect("mongodb+srv://jagdishsinghmehra25:24bf8hU7vH2BGahW@nodelearning.6xhz9.mongodb.net/devTinder")

// as connecting to db it will retun a promise so we have to use . then   
}
module.exports={connectdb}


