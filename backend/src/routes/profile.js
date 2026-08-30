const express=require('express');
const profileRouter=express.Router();

const {authUser} = require('../middleware/auth');
const {validateEditProfileData} = require('../utils/validation');

profileRouter.get('/profile/view',authUser,(req,res)=>{
    try{
        const user=req.user;;
        res.send(user);
    }
    catch(err){
        res.status(400).send('Error fetching profile: ' + err.message);
    }
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    validateEditProfileData(req);

    const { firstName, lastName, age, gender, about, skills, photoUrl } = req.body;
    const user = req.user;

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (about !== undefined) user.about = about;
    if (skills !== undefined) user.skills = skills;
    if (photoUrl !== undefined) user.photoUrl = photoUrl;

    await user.save();

    return res.status(200).json({ data: user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports=profileRouter;