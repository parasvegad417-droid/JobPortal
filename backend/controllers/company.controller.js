import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { isValidHttpUrl } from "../utils/validation.js";

export const registerCompany = async (req, res) => {
    try {
        const companyName = String(req.body.companyName || "").trim();
        if (!companyName || companyName.length > 100) {
            return res.status(400).json({
                message: "Company name is required and must be 100 characters or fewer.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
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
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
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
export const updateCompany = async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const description = String(req.body.description || "").trim();
        const website = String(req.body.website || "").trim();
        const location = String(req.body.location || "").trim();
        const file = req.file;

        if (!name || name.length > 100 || !description || description.length > 1000 ||
            !location || location.length > 100 || website.length > 2048 ||
            (website && !isValidHttpUrl(website))) {
            return res.status(400).json({
                message: "Enter a company name (up to 100 characters), description (up to 1000 characters), location (up to 100 characters), and a valid HTTP(S) website URL.",
                success: false
            });
        }
        if (file && !file.mimetype.startsWith("image/")) {
            return res.status(400).json({
                message: "Company logo must be an image.",
                success: false
            });
        }

        const updateData = { name, description, website, location };
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}