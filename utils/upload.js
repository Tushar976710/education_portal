const multer = require("multer")
const { v4: uuid } = require("uuid")
const path = require("path")
const fs = require("fs")



const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync("profile")) {
            fs.mkdirSync("profile");
        }
        cb(null, "profile");
    },
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
});
const galleryStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname))
    },
    destination: (req, file, cb) => {
        if (!fs.existsSync("video")) {
            fs.mkdirSync("video")
        }
        cb(null, "video")
    }
})

const uploadProfile = multer({ storage: profileStorage }).single("avatar")
const uploadGallery = multer({ storage: galleryStorage }).single("video")

module.exports = { uploadProfile, uploadGallery }