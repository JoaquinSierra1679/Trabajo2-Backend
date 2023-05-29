import mongoose from "mongoose";
import CartCollection from "../models/carts.model.js"

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:String,
    age:Number,
    password:String,
    role:{
        type:String,
        require:true,
        enum:["user", "admin"],
        default:"user"
    },
    cart:{
        type:[
            {
                cart:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: CartCollection,
                },
            },
        ],
        default:[],
    },
});


export const UserModel = mongoose.model(userCollection,userSchema);