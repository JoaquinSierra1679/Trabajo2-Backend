import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({

    products:{
        type: [
            {
                product : {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"products",

                },
                quantity:Number,
            },
        ],
        default:[],

    },

});

cartsSchema.pre("findOne", function(){
    this.populate("products.product");
})

const cartModel = mongoose.model("carts", cartsSchema);
export default cartModel;