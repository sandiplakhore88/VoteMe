require("dotenv").config();
const mongoose = require("mongoose");

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("mongodb connect..!")
})
.catch((err)=>{
    console.log("Failed to connect..!", err.message);
    process.exit(1);
})



// <====== setting Schema and model for admin login ======>
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});
const adminCollection = mongoose.model("admins", adminSchema);


// <====== setting Schema and model for voter login ======>
// const voterSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// });
// const voterCollection = mongoose.model("voters", voterSchema);


// <====== setting Schema and model for voter details ======>
const voterDetailSchema = new mongoose.Schema({
    vid: {
        type: String,
        required: true
    },
    vname: {
        type: String,
        required: true
    },
    vbranch: {
        type: String,
        required: true
    },
    vclass: {
        type: String,
        required: true
    },
    vpassword:{
        type: String,
        required: true
    }
});
const vDetailCollection = mongoose.model("voterdetails",voterDetailSchema);






// <====== export models ======>
module.exports = { adminCollection, vDetailCollection };


