import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import { dataHandler, uploadHandler, uploadMiddleware } from "./controllers/uploader.js";

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());

app.post('/upload', uploadMiddleware, uploadHandler)
app.get('/', dataHandler)

mongoose.connect(process.env.MongoDB_URL).then(() => {
    console.log("connected to mongodb")
}).catch((e) => {
    console.log(e);
})


app.listen(5000, () => {
    console.log('port listening on 5000')
})
