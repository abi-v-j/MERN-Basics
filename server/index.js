// -------------------- Imports --------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// -------------------- App Setup --------------------
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// -------------------- Database Connection --------------------
mongoose
    .connect("mongodb+srv://main:main@cluster0main.ztxrgoz.mongodb.net/db_mernstack")
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });

// -------------------- File Upload Setup --------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "./public/uploads";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// -------------------- Schemas & Models --------------------
const districtSchema = new mongoose.Schema(
    { name: { type: String, required: true, trim: true } },
    { collection: "districts", timestamps: true }
);

const placeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District", required: true },
    },
    { collection: "places", timestamps: true }
);

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        photo: { type: String, default: "" },
        placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
    },
    { collection: "users", timestamps: true }
);

const District = mongoose.model("District", districtSchema);
const Place = mongoose.model("Place", placeSchema);
const User = mongoose.model("User", userSchema);

// -------------------- DISTRICT API --------------------
app.post("/district", async (req, res) => {
    try {
        const { name } = req.body;
        await District.create({ name });
        const data = await District.aggregate([
            {
                $project: {
                    districtId: "$_id",
                    districtName: "$name",
                    createdAt: 1,
                    updatedAt: 1,
                    _id: 0
                }
            }
        ]);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/district", async (req, res) => {
    try {
        const data = await District.aggregate([
            {
                $project: {
                    districtId: "$_id",
                    districtName: "$name",
                    createdAt: 1,
                    updatedAt: 1,
                    _id: 0
                }
            }
        ]);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/district/:id", async (req, res) => {
    await District.findByIdAndDelete(req.params.id);
    const data = await District.aggregate([
        {
            $project: {
                districtId: "$_id",
                districtName: "$name",
                createdAt: 1,
                updatedAt: 1,
                _id: 0
            }
        }
    ]);
    res.json({ data });
});

app.put("/district/:id", async (req, res) => {
    const { name } = req.body;
    await District.findByIdAndUpdate(req.params.id, { name });
    const data = await District.aggregate([
        {
            $project: {
                districtId: "$_id",
                districtName: "$name",
                createdAt: 1,
                updatedAt: 1,
                _id: 0
            }
        }
    ]);
    res.json({ data });
});

// -------------------- PLACE API --------------------
app.post("/place", async (req, res) => {
    try {
        const { name, districtId } = req.body;
        await Place.create({ name, districtId });
        const data = await Place.aggregate([
            {
                $lookup: {
                    from: "districts",
                    localField: "districtId",
                    foreignField: "_id",
                    as: "district"
                }
            },
            {
                $unwind: "$district"
            },
            {
                $project: {
                    placeId: "$_id",
                    placeName: "$name",
                    districtId: "$district._id",
                    districtName: "$district.name",
                    createdAt: 1,
                    updatedAt: 1,
                    _id: 0
                }
            }
        ]);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/place", async (req, res) => {
    try {
        const data = await Place.aggregate([
            {
                $lookup: {
                    from: "districts",
                    localField: "districtId",
                    foreignField: "_id",
                    as: "district"
                }
            },
            {
                $unwind: "$district"
            },
            {
                $project: {
                    placeId: "$_id",
                    placeName: "$name",
                    districtId: "$district._id",
                    districtName: "$district.name",
                    createdAt: 1,
                    updatedAt: 1,
                    _id: 0
                }
            }
        ]);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/place/:id", async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    const data = await Place.aggregate([
        {
            $lookup: {
                from: "districts",
                localField: "districtId",
                foreignField: "_id",
                as: "district"
            }
        },
        {
            $unwind: "$district"
        },
        {
            $project: {
                placeId: "$_id",
                placeName: "$name",
                districtId: "$district._id",
                districtName: "$district.name",
                createdAt: 1,
                updatedAt: 1,
                _id: 0
            }
        }
    ]);
    res.json({ data });
});

app.put("/place/:id", async (req, res) => {
    const { name, districtId } = req.body;
    await Place.findByIdAndUpdate(req.params.id, { name, districtId });
    const data = await Place.aggregate([
        {
            $lookup: {
                from: "districts",
                localField: "districtId",
                foreignField: "_id",
                as: "district"
            }
        },
        {
            $unwind: "$district"
        },
        {
            $project: {
                placeId: "$_id",
                placeName: "$name",
                districtId: "$district._id",
                districtName: "$district.name",
                createdAt: 1,
                updatedAt: 1,
                _id: 0
            }
        }
    ]);
    res.json({ data });
});

// -------------------- USER API --------------------
app.post("/user", upload.single("photo"), async (req, res) => {
    try {
        const { fullName, email, password, placeId } = req.body;
        const photo = req.file ? `/uploads/${req.file.filename}` : "";
        await User.create({ fullName, email, password, photo, placeId });
        res.json({ message: "User added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------- LOGIN --------------------
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        return res.json({
            role: "user",
            id: user._id,
            name: user.fullName,
            message: "Login successful",
        });
    }
    return res.status(401).json({ message: "Invalid email or password" });
});

// -------------------- USER DETAIL --------------------
app.get("/user/:id", async (req, res) => {
    try {
        const data = await User.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup: {
                    from: "places",
                    localField: "placeId",
                    foreignField: "_id",
                    as: "place"
                }
            },
            {
                $unwind: "$place"
            },
            {
                $lookup: {
                    from: "districts",
                    localField: "place.districtId",
                    foreignField: "_id",
                    as: "district"
                }
            },
            {
                $unwind: "$district"
            },
            {
                $project: {
                    userId: "$_id",
                    fullName: 1,
                    email: 1,
                    photo: 1,
                    placeId: "$place._id",
                    placeName: "$place.name",
                    districtId: "$district._id",
                    districtName: "$district.name",
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    _id: 0
                }
            }
        ]);

        if (!data.length) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ data: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------- USER UPDATE --------------------
app.put("/user/:id", async (req, res) => {
    const { fullName, email, placeId } = req.body;
    await User.findByIdAndUpdate(req.params.id, { fullName, email, placeId });
    res.json({ message: "Updated" });
});

// -------------------- CHANGE PASSWORD --------------------
app.put("/userPassword/:id", async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: req.params.id, password: oldPassword });
    if (!user)
        return res.json({ message: "Old password is incorrect" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});