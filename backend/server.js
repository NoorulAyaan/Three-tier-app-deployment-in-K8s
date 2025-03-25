require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:password@192.168.49.2:27017/userDB";
const JWT_SECRET = process.env.JWT_SECRET || "yourSuperSecretKey";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "✅ User registered successfully!", token, user: { name, email } });
  } catch (error) {
    res.status(500).json({ message: "❌ Error registering user", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "❌ Invalid email or password!" });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: `✅ Welcome, ${user.name}!`, token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "❌ Error logging in", error: error.message });
  }
});

// ✅ Fix: Default Route to prevent "Cannot GET /"
app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend is running!" });
});

// Fix: Make sure the correct port number is printed
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

























































// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcrypt");

// const app = express();
// app.use(express.json());
// app.use(cors());

// const MONGO_URI = "mongodb://localhost:27017/userDB";
// mongoose
//   .connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String, // Only stored at signup
// });

// const User = mongoose.model("User", UserSchema);

// // ✅ Signup - Stores user credentials
// app.post("/api/auth/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     console.log("📥 Signup Request Data:", req.body);

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "❌ User already exists!" });
//     }

//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();
    
//     res.status(201).json({ message: "✅ User registered successfully!" });
//   } catch (error) {
//     console.error("🔥 Signup Error:", error);
//     res.status(500).json({ message: "❌ Error registering user", error: error.message });
//   }
// });

// // ✅ Login - Just verifies credentials, does NOT store anything
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("📥 Login Request Data:", req.body);

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "❌ Invalid email or password!" });
//     }

//     // Compare hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "❌ Invalid email or password!" });
//     }

//     res.status(200).json({ message: `✅ Welcome, ${user.name}!`, user: { name: user.name, email: user.email } });

//   } catch (error) {
//     console.error("🔥 Login Error:", error);
//     res.status(500).json({ message: "❌ Error logging in", error: error.message });
//   }
// });

// // Default Route (For Debugging)
// app.get("/", (req, res) => {
//   res.send("🚀 Server is running!");
// });

// // Start Server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
