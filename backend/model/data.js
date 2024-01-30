import mongoose, { Schema } from "mongoose";

const dataSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: Buffer,
        contentType: String,
        required: true
    }
})

export default mongoose.model("data", dataSchema)