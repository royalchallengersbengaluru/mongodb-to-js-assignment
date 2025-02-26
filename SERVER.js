const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 2000;
const MONGOURL = process.env.MONGO_URL;

app.use(express.json());

mongoose.connect(MONGOURL).then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

const teacherSchema = new mongoose.Schema({
    name: String,
    subject: String,
    email: String,
    experience: Number,
    department: String
});

const courseSchema = new mongoose.Schema({
    name: String,
    duration: String
});

const teacherModel = mongoose.model("teachers", teacherSchema);
const courseModel = mongoose.model("courses", courseSchema);

app.get("/getteachers", async (req, res) => {
    try {
        const teachers = await teacherModel.find();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching teachers", error });
    }
});

app.get("/getcourses", async (req, res) => {
    try {
        const courses = await courseModel.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error });
    }
});

app.post("/addteacher", async (req, res) => {
    const { name, subject, email, experience, department } = req.body;
    const newTeacher = new teacherModel({ name, subject, email, experience, department });
    try {
        await newTeacher.save();
        res.status(201).json({ message: "Teacher added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding teacher", error });
    }
});

app.post("/addcourse", async (req, res) => {
    const { name, duration } = req.body;
    const newCourse = new courseModel({ name, duration });
    try {
        await newCourse.save();
        res.status(201).json({ message: "Course added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding course", error });
    }
});

app.delete("/deleteteacher/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTeacher = await teacherModel.findByIdAndDelete(id);
        if (deletedTeacher) {
            res.status(200).json({ message: "Teacher deleted successfully" });
        } else {
            res.status(404).json({ message: "Teacher not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting teacher", error });
    }
});

app.delete("/deletecourse/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCourse = await courseModel.findByIdAndDelete(id);
        if (deletedCourse) {
            res.status(200).json({ message: "Course deleted successfully" });
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting course", error });
    }
});

// Route to update a teacher by ID
app.put("/updateteacher/:id", async (req, res) => {
    const { id } = req.params;
    const { name, subject, email, experience, department } = req.body;
    try {
        const updatedTeacher = await teacherModel.findByIdAndUpdate(id, { name, subject, email, experience, department }, { new: true });
        if (updatedTeacher) {
            res.status(200).json({ message: "Teacher updated successfully", updatedTeacher });
        } else {
            res.status(404).json({ message: "Teacher not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating teacher", error });
    }
});

// Route to update a course by ID
app.put("/updatecourse/:id", async (req, res) => {
    const { id } = req.params;
    const { name, duration } = req.body;
    try {
        const updatedCourse = await courseModel.findByIdAndUpdate(id, { name, duration }, { new: true });
        if (updatedCourse) {
            res.status(200).json({ message: "Course updated successfully", updatedCourse });
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating course", error });
    }
});