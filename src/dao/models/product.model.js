import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = 'products'

const productSchema = new mongoose.Schema({
    title: {type: String,  required: true},
    description:  {type: String, required: true},
    price: {type: Number, required: true},
    code: {type: String, unique: true,required: true},
    status: {type: Boolean, default: true},
    stock: {type: Number, required: true},
    category:{type: String, required: true},
    thumbnail: {type: [String], default: []},
})


productSchema.plugin(mongoosePaginate);

mongoose.set('strictQuery',false)

export const productModel = mongoose.model(productsCollection,productSchema)