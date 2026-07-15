const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(cors(
    {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());
require('dotenv').config();

const authRouter=require('./routes/auth');
const profileRouter=require('./routes/profile');
const userRouter=require('./routes/user');
const requestRouter=require('./routes/request');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',userRouter);
app.use('/',requestRouter);

// app.get('/user',async(req,res)=>{
//     const userEmail=req.body.emailId;
//     try{
//         const users=await User.find({emailId: userEmail});
//         if(users.length===0){
//             res.status(404).send('User not found');
//         }
//         else{
//             res.send(users);    
//         }
//     }
//     catch(err){
//         res.status(400).send('Error fetching user: ' + err.message);
//     }   
// });

// app.get('/feed',async(req,res)=>{
//     try{
//         const users=await User.find({});
//         if(users.length===0){
//             res.status(404).send('No users found');
//         }
//         else{
//             res.send(users);
//         }
//     }
//     catch(err){
//         res.status(400).send('Error fetching users: ' + err.message);
//     }
// });

// app.delete('/user',async(req,res)=>{
//     const id=req.body.id;
//     try{
//         const user=await User.findByIdAndDelete(id);    
//         res.send('User deleted successfully');
//     }
//     catch(err){
//         res.status(400).send('Error deleting user: ' + err.message);
//     }
// });

// app.patch('/user',async(req,res)=>{
//     const id=req.body.id;
//     try{
//         const user=await User.findByIdAndUpdate(id,req.body);
//         res.send('User updated successfully');
//     }
//     catch(err){
//         res.status(400).send('Error updating user: ' + err.message);
//     }
// });

connectDB().then(() => {
    console.log('Connected to the database');
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

}).catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1); // Exit the process with an error code
});