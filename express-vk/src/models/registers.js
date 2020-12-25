const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const memberSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
   
    email : {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    }
})
memberSchema.pre("save",async function(next) {
    if(this.isModified("password")){
        console.log('${this.password}');
        this.password =await bcrypt.hash(this.password,10);
        this.confirmpassword=undefined;
    }
    next();
})

const Register = new mongoose.model("UserInfo", memberSchema);

module.exports = Register;