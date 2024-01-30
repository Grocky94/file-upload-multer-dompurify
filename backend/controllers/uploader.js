import multer from "multer";
// import path from "path";
import store from "../model/data.js";


//const storage = multer.diskStorage({
// destination: "uploads",
// filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now() + "-" + path.extname(file.originalname));
// },
//})

const upload = multer({
    // storage: storage,
    //set file limit to 1 mb
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(JPG|JPEG|GIF|PNG|DOC|DOCX)$/i)) {
            cb(new Error("Invalid file type"));
        } else {
            cb(null, true);
        }
    },
});

export const uploadMiddleware = upload.single("image");

export const uploadHandler = async (req, res) => {
    try {
        if (req.file || req.body) {
            const { name, price, description } = req.body;
            const imageURL = req.file.buffer;
            const newData = new store({
                name, price, description, image: imageURL
            });
            await newData.save();
            res.status(200).json({
                success: true,
                message: "File got uploaded successfully",
                data: newData
            });
        } else {
            res.status(404).json({ success: false, message: "No file provided" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const dataHandler = async (req, res) => {
    try {
        const find = await store.find({});
        if (find) {
            res.status(200).json({ success: true, data: find });
        } else {
            res.status(404).json({ success: false, message: "No data found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};




// for client side

// Assuming response.data contains the server response
// const base64Data = response.data.base64Data;
// const binaryData = atob(base64Data);

// Use binaryData as needed, e.g., create a Blob or perform further processing
