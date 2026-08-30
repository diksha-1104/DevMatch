const validator=require('validator');
const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName || !emailId || !password){  
        throw new Error('Missing required fields');
    }
    if(firstName.length<3 || firstName.length>30){
        throw new Error('First name must be between 3 and 30 characters');
    }
    if(!validator.isAlpha(firstName)){
        throw new Error('First name must contain only letters');
    }
    if(!validator.isEmail(emailId)){
        throw new Error('Invalid email format');    
    }
    if(!validator.isStrongPassword(password,{minLength:8,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:1})){
        throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol');
    }

};

const validateEditProfileData=(req)=>{
    const allowedFields=['firstName','lastName','age','gender','about','skills','photoUrl'];
    const updates=Object.keys(req.body || {});
    const isValidOperation=updates.every((update)=>allowedFields.includes(update));

    if(!isValidOperation){
        throw new Error('Invalid update fields');
    }
return true;
};

module.exports={validateSignUpData, validateEditProfileData};