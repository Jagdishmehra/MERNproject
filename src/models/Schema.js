const mongoose=require('mongoose')

const {Schema}=mongoose  //this is one way otheer way is directly extracting values from mongoose obj
const userSchema= new Schema({  //or use mongoose.schema
firstName: String, //this is known as shorthand method of declaration.
lastName: String,
age: Number,
email:String,
address:{type:String,    //this is a nested adress obj. the actual representation
}
});

// step-2
// now for the step 2 we have to create model for our schema.
const UserModel=new mongoose.model("UserModel",userSchema)
// we have converted our schema in model so that we can easily perform any query or operations like 
// CRUD directly in mongodb.

//step-3
//we have to export our model
 
module.exports={UserModel};