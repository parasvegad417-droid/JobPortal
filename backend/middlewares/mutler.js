import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");

const resumeUpload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single("file");

export const singleResumeUpload = (req, res, next) => {
    resumeUpload(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            const isFileTooLarge = error.code === "LIMIT_FILE_SIZE";
            return res.status(isFileTooLarge ? 413 : 400).json({
                message: isFileTooLarge
                    ? "Resume must be 10 MB or smaller."
                    : "Unable to process the uploaded resume.",
                success: false
            });
        }
        if (error) return next(error);
        next();
    });
};