import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
export const uploadBuffer = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};
