import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
    code:{
        type:Number,
        required: true
    },
    title:String,
    description:String,
    price:Number,
    thumbnail:{
        type:Array,
        default:[],
    },
    stock:Number,
    status:Boolean,
    category:String
});

productsSchema.plugin(mongoosePaginate);

const productModel = mongoose.model("products", productsSchema);
export default productModel;