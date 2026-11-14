import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { isValidEmail, isValidPhoneNumber } from "../utils/validation.js";

export const register = async (req, res) => {
    try {
        const fullname = String(req.body.fullname || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const phoneNumber = String(req.body.phoneNumber || "").trim();
        const password = String(req.body.password || "");
        const { role } = req.body;
        const file = req.file;

        if (!fullname || fullname.length > 80 || !isValidEmail(email) || email.length > 254 ||
            !isValidPhoneNumber(phoneNumber) || password.length < 8 || password.length > 128 ||
            !["student", "recruiter"].includes(role)) {
            return res.status(400).json({
                message: "Enter a name (up to 80 characters), valid email, 10-digit phone number, password with at least 8 characters, and valid role.",
                success: false
            });
        };
        if (file && !file.mimetype.startsWith("image/")) {
            return res.status(400).json({
                message: "Profile photo must be an image.",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const cloudResponse = file
            ? await cloudinary.uploader.upload(getDataUri(file).content)
            : null;
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse?.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const login = async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");
        const { role } = req.body;

        if (!isValidEmail(email) || email.length > 254 || !password || password.length > 128 ||
            !["student", "recruiter"].includes(role)) {
            return res.status(400).json({
                message: "Enter a valid email, password, and role.",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }


        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const fullname = String(req.body.fullname || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const phoneNumber = String(req.body.phoneNumber || "").trim();
        const bio = String(req.body.bio || "").trim();
        const skills = String(req.body.skills || "");
        const file = req.file;

        if (!fullname || fullname.length > 80 || !isValidEmail(email) || email.length > 254 ||
            !isValidPhoneNumber(phoneNumber) || bio.length > 500 || skills.length > 1000) {
            return res.status(400).json({
                message: "Enter a name (up to 80 characters), valid email, 10-digit phone number, bio up to 500 characters, and skills up to 1000 characters.",
                success: false
            });
        }
        if (file && file.mimetype !== "application/pdf") {
            return res.status(400).json({
                message: "Resume must be a PDF file.",
                success: false
            });
        }

        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        const emailInUse = await User.findOne({ email, _id: { $ne: userId } });
        if (emailInUse) {
            return res.status(400).json({
                message: "This email is already in use.",
                success: false
            });
        }

        const resumePublicId = file
            ? `${file.originalname.replace(/\.pdf$/i, "").replace(/[^a-zA-Z0-9_-]/g, "-")}-${Date.now()}.pdf`
            : null;
        const cloudResponse = file
            ? await cloudinary.uploader.upload(getDataUri(file).content, {
                resource_type: "raw",
                public_id: resumePublicId
            })
            : null;

        // updating data
        user.fullname = fullname;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.profile.bio = bio;
        user.profile.skills = skills.split(",").map(skill => skill.trim()).filter(Boolean);

        // resume comes later here...
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}