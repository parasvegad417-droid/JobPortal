import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import mongoose from "mongoose";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const title = String(req.body.title || "").trim();
        const description = String(req.body.description || "").trim();
        const requirements = String(req.body.requirements || "").trim();
        const location = String(req.body.location || "").trim();
        const jobType = String(req.body.jobType || "").trim();
        const salary = Number(req.body.salary);
        const experience = Number(req.body.experience);
        const position = Number(req.body.position);
        const { companyId } = req.body;
        const userId = req.id;

        if (!title || title.length > 120 || !description || description.length > 2000 ||
            !requirements || requirements.length > 2000 || !location || location.length > 100 ||
            !jobType || jobType.length > 60 || !Number.isFinite(salary) || salary <= 0 ||
            !Number.isFinite(experience) || experience < 0 ||
            !Number.isInteger(position) || position < 1 ||
            !mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Enter all required job details with valid lengths, positive salary, non-negative experience, and at least one position.",
                success: false
            })
        };
        const company = await Company.findOne({ _id: companyId, userId });
        if (!company) {
            return res.status(400).json({
                message: "Select a company that belongs to your account.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(",").map(requirement => requirement.trim()).filter(Boolean),
            salary,
            location,
            jobType,
            experienceLevel: Number(experience),
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
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
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
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
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({
            $or: [{ created_by: adminId }, { createdBy: adminId }]
        }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
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
