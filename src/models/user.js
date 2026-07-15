const mongoose=require('mongoose');
const { Timestamp } = require('mongodb');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,  
        minlength:3,
        maxlength:30,   
        index:true,      
    }, 
    lastName:{
        type:String, 
        minlength:3,
        maxlength:30,
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,  
    },
    password:{
        type:String,
        required:true,  
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
    },
    about : {
        type:String,
    },
    skills:{
        type:[String],
        default:[],
    },
    photoUrl:{
        type:String,
        default:"https://i.sstatic.net/l60Hf.png"
    },

},{timestamps:true});

userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'1h' });
    return token;
};

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,user.password);
    return isPasswordValid;
};


const User=mongoose.model('User',userSchema);
module.exports=User;