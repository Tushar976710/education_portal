
const asynHandler = require("express-async-handler")
const { uploadProfile, uploadGallery } = require("../utils/upload")
const fs = require('fs/promises')
const path = require("path")
const Lecture = require("../modal/Lecture")

exports.addProduct = async (req, res) => {
    uploadGallery(req, res, async err => {
        if (err) {
            console.error(err);
            return res.status(400).json({ message: err.message || "Unable to upload file" });
        }
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const videoFilename = req.file.filename;
            await Lecture.create({ title: req.body.title, desc: req.body.desc, subject: req.body.subject, video: videoFilename });
            res.status(201).json({ message: "Product created successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
};
exports.getAllProduct = async (req, res) => {
    try {
        const lectures = await Lecture.find();

        // Assuming Lecture model has a field 'videos' containing filenames of the videos
        // const videoUrls = lectures.map(lecture => {
        //     return lecture.video.map(video => {
        //         return `/videos/${video}`; // Assuming the videos are served from a route like '/videos/:filename'
        //     });
        // });

        res.status(200).json({ message: "Product fetch success", lectures });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

