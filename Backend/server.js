import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
import Employee from "./src/models/Employee.js";
import Machine from "./src/models/Machine.js";
import Game from "./src/models/Game.js";
import Booking from "./src/models/Booking.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
  });

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, req.body);
  next();
});

// Sample route to test
app.get("/", (req, res) => {
  res.send("Backend is working and connected to MongoDB ✅");
});

// ✅ Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    console.log("🔐 Register attempt:", req.body);
    
    const { name, email, phone, password, role } = req.body;

    // Check required fields
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log("🔍 Existing user check:", existingUser ? "User exists" : "No user found");
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      role
    });

    console.log("💾 Saving user to database...");
    await user.save();
    console.log("✅ User saved successfully:", { 
      _id: user._id, 
      email: user.email, 
      role: user.role,
      customerId: user.customerId 
    });
    
    res.status(201).json({ 
      message: "User registered successfully", 
      user: {
        _id: user._id,        // ✅ CHANGED: id → _id
        name: user.name,
        email: user.email,
        role: user.role,
        customerId: user.customerId
      }
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("🔐 Login attempt:", { email: req.body.email, role: req.body.role });
    
    const { email, password, role } = req.body;

    // Check required fields
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log("🔍 User found in database:", user ? `Yes (${user.email})` : "No user found");
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check role
    if (user.role !== role) {
      console.log(`❌ Role mismatch. User role: ${user.role}, Requested role: ${role}`);
      return res.status(400).json({ message: `No ${role} account found with this email` });
    }

    // Debug: Log password check
    console.log("🔑 Checking password...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("✅ Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("❌ Password validation failed");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ Login successful for user:", user.email);
    res.json({ 
      message: "Login successful", 
      user: {
        _id: user._id,        // ✅ CHANGED: id → _id
        name: user.name,
        email: user.email,
        role: user.role,
        customerId: user.customerId
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

// ✅ Employee Routes
app.get("/api/employees", async (req, res) => {
  try {
    console.log("🔍 Fetching all employees...");
    const employees = await Employee.find({});
    console.log(`✅ Found ${employees.length} employees`);
    res.json({ employees });
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/employees", async (req, res) => {
  try {
    console.log("👤 Adding new employee:", req.body);
    
    const { employeeId, name, email, phone, role, status } = req.body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ 
      $or: [{ email }, { employeeId }] 
    });
    
    if (existingEmployee) {
      return res.status(400).json({ 
        message: "Employee with this email or ID already exists" 
      });
    }

    const employee = new Employee({
      employeeId,
      name,
      email,
      phone,
      role,
      status
    });

    await employee.save();
    console.log("✅ Employee added successfully");
    res.status(201).json({ 
      message: "Employee added successfully", 
      employee 
    });

  } catch (error) {
    console.error("❌ Error adding employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/employees/:id", async (req, res) => {
  try {
    console.log("✏️ Updating employee:", req.params.id, req.body);
    
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log("✅ Employee updated successfully");
    res.json({ 
      message: "Employee updated successfully", 
      employee 
    });

  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/api/employees/:id", async (req, res) => {
  try {
    console.log("🗑️ Deleting employee:", req.params.id);
    
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log("✅ Employee deleted successfully");
    res.json({ message: "Employee deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Machine Routes
app.get("/api/machines", async (req, res) => {
  try {
    console.log("🔍 Fetching all machines...");
    const machines = await Machine.find({});
    console.log(`✅ Found ${machines.length} machines`);
    res.json({ machines });
  } catch (error) {
    console.error("❌ Error fetching machines:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/machines", async (req, res) => {
  try {
    console.log("🖥️ Adding new machine:", req.body);
    
    const { machineId, name, gameId, gameName, status, maintenanceInfo, lastMaintenance, nextMaintenance } = req.body;

    // Check if machine already exists
    const existingMachine = await Machine.findOne({ machineId });
    
    if (existingMachine) {
      return res.status(400).json({ 
        message: "Machine with this ID already exists" 
      });
    }

    const machine = new Machine({
      machineId,
      name,
      gameId,
      gameName,
      status,
      maintenanceInfo,
      lastMaintenance,
      nextMaintenance
    });

    await machine.save();
    console.log("✅ Machine added successfully");
    res.status(201).json({ 
      message: "Machine added successfully", 
      machine 
    });

  } catch (error) {
    console.error("❌ Error adding machine:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/machines/:id", async (req, res) => {
  try {
    console.log("✏️ Updating machine:", req.params.id, req.body);
    
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    console.log("✅ Machine updated successfully");
    res.json({ 
      message: "Machine updated successfully", 
      machine 
    });

  } catch (error) {
    console.error("❌ Error updating machine:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/api/machines/:id", async (req, res) => {
  try {
    console.log("🗑️ Deleting machine:", req.params.id);
    
    const machine = await Machine.findByIdAndDelete(req.params.id);

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    console.log("✅ Machine deleted successfully");
    res.json({ message: "Machine deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting machine:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update machine status
app.patch("/api/machines/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    console.log("🔄 Updating machine status:", req.params.id, status);
    
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    console.log("✅ Machine status updated successfully");
    res.json({ 
      message: "Machine status updated successfully", 
      machine 
    });

  } catch (error) {
    console.error("❌ Error updating machine status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Assign game to machine
app.patch("/api/machines/:id/game", async (req, res) => {
  try {
    const { gameId, gameName } = req.body;
    console.log("🎮 Assigning game to machine:", req.params.id, gameId, gameName);
    
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { gameId, gameName },
      { new: true }
    );

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    console.log("✅ Game assigned to machine successfully");
    res.json({ 
      message: "Game assigned to machine successfully", 
      machine 
    });

  } catch (error) {
    console.error("❌ Error assigning game to machine:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Game Routes
app.get("/api/games", async (req, res) => {
  try {
    console.log("🎮 Fetching all games...");
    const games = await Game.find({});
    console.log(`✅ Found ${games.length} games`);
    res.json({ games });
  } catch (error) {
    console.error("❌ Error fetching games:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/games", async (req, res) => {
  try {
    console.log("🎮 Adding new game:", req.body);
    
    const { gameId, name, cost, type, maintenanceStatus, description } = req.body;

    // Check if game already exists
    const existingGame = await Game.findOne({ 
      $or: [{ gameId }, { name }] 
    });
    
    if (existingGame) {
      return res.status(400).json({ 
        message: "Game with this ID or name already exists" 
      });
    }

    const game = new Game({
      gameId,
      name,
      cost: parseFloat(cost),
      type,
      maintenanceStatus,
      description
    });

    await game.save();
    console.log("✅ Game added successfully");
    res.status(201).json({ 
      message: "Game added successfully", 
      game 
    });

  } catch (error) {
    console.error("❌ Error adding game:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/games/:id", async (req, res) => {
  try {
    console.log("✏️ Updating game:", req.params.id, req.body);
    
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        cost: parseFloat(req.body.cost)
      },
      { new: true, runValidators: true }
    );

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    console.log("✅ Game updated successfully");
    res.json({ 
      message: "Game updated successfully", 
      game 
    });

  } catch (error) {
    console.error("❌ Error updating game:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/api/games/:id", async (req, res) => {
  try {
    console.log("🗑️ Deleting game:", req.params.id);
    
    const game = await Game.findByIdAndDelete(req.params.id);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    console.log("✅ Game deleted successfully");
    res.json({ message: "Game deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting game:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update game status
app.patch("/api/games/:id/status", async (req, res) => {
  try {
    const { maintenanceStatus } = req.body;
    console.log("🔄 Updating game status:", req.params.id, maintenanceStatus);
    
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { maintenanceStatus },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    console.log("✅ Game status updated successfully");
    res.json({ 
      message: "Game status updated successfully", 
      game 
    });

  } catch (error) {
    console.error("❌ Error updating game status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Booking Routes - FIXED VERSION
app.get("/api/bookings", async (req, res) => {
  try {
    console.log("📅 Fetching all bookings...");
    const bookings = await Booking.find({}).sort({ bookingDate: -1 });
    console.log(`✅ Found ${bookings.length} bookings`);
    res.json({ bookings });
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/bookings/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("📅 Fetching user bookings:", userId);
    
    const bookings = await Booking.find({ userId }).sort({ bookingDate: -1 });
    console.log(`✅ Found ${bookings.length} bookings for user ${userId}`);
    res.json({ bookings });
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ FIXED: Booking creation with proper bookingId handling
app.post("/api/bookings", async (req, res) => {
  try {
    console.log("📅 Creating new booking:", req.body);
    
    const {
      userId,
      userName,
      userEmail,
      gameId,
      gameName,
      machineId,
      bookingDate,
      startTime,
      duration,
      totalCost,
      paymentMethod,
      notes
    } = req.body;

    // Validate required fields
    if (!userId || !userName || !userEmail || !gameId || !gameName || !bookingDate || !startTime || !duration || !totalCost || !paymentMethod) {
      return res.status(400).json({ 
        message: "Missing required booking fields" 
      });
    }

    // Check for conflicting bookings (same machine and time)
    const existingBooking = await Booking.findOne({
      machineId,
      bookingDate: new Date(bookingDate),
      startTime,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: "This time slot is already booked. Please choose a different time." 
      });
    }

    // Generate unique booking ID
    const generateBookingId = () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(1000 + Math.random() * 9000);
      return `BKG${timestamp}${random}`;
    };

    // Create booking with auto-generated bookingId
    const bookingData = {
      bookingId: generateBookingId(), // Auto-generated
      userId: userId, // Keep as string to match frontend
      userName,
      userEmail,
      gameId,
      gameName,
      machineId: machineId || `MACH${Math.floor(100 + Math.random() * 900)}`,
      bookingDate: new Date(bookingDate),
      startTime,
      duration: parseInt(duration),
      totalCost: parseFloat(totalCost),
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'Paid' : 'Pending',
      notes: notes || `Booking for ${gameName}`,
      status: 'Confirmed'
    };

    console.log("📝 Creating booking with data:", bookingData);

    const booking = new Booking(bookingData);
    await booking.save();
    
    console.log("✅ Booking created successfully:", booking.bookingId);
    
    res.status(201).json({ 
      message: "Booking created successfully", 
      booking 
    });

  } catch (error) {
    console.error("❌ Error creating booking:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Booking validation failed", 
        errors 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Booking ID already exists. Please try again." 
      });
    }
    
    res.status(500).json({ 
      message: "Server error while creating booking", 
      error: error.message 
    });
  }
});

app.put("/api/bookings/:id", async (req, res) => {
  try {
    console.log("✏️ Updating booking:", req.params.id, req.body);
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ Booking updated successfully");
    res.json({ 
      message: "Booking updated successfully", 
      booking 
    });

  } catch (error) {
    console.error("❌ Error updating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    console.log("🗑️ Deleting booking:", req.params.id);
    
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ Booking deleted successfully");
    res.json({ message: "Booking deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update booking status
app.patch("/api/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    console.log("🔄 Updating booking status:", req.params.id, status);
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ Booking status updated successfully");
    res.json({ 
      message: "Booking status updated successfully", 
      booking 
    });

  } catch (error) {
    console.error("❌ Error updating booking status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get available time slots for a date
app.get("/api/bookings/availability/:date", async (req, res) => {
  try {
    const { date } = req.params;
    console.log("🕒 Checking availability for date:", date);
    
    // Validate date format
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ 
        message: "Invalid date format" 
      });
    }

    const bookings = await Booking.find({
      bookingDate: new Date(date),
      status: { $in: ['Pending', 'Confirmed'] }
    });

    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    const bookedSlots = bookings.map(booking => booking.startTime);
    const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

    console.log(`📊 Available slots for ${date}:`, availableSlots.length);
    
    res.json({ 
      date, 
      availableSlots,
      bookedSlots,
      totalAvailable: availableSlots.length
    });

  } catch (error) {
    console.error("❌ Error checking availability:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get booking by bookingId
app.get("/api/bookings/booking/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log("📅 Fetching booking by ID:", bookingId);
    
    const booking = await Booking.findOne({ bookingId });
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ Booking found:", booking.bookingId);
    res.json({ booking });

  } catch (error) {
    console.error("❌ Error fetching booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Debug route to check all users
app.get("/api/debug/users", async (req, res) => {
  try {
    const users = await User.find({});
    console.log("📊 All users in database:", users.length);
    res.json({ 
      totalUsers: users.length,
      users: users.map(user => ({
        _id: user._id,        // ✅ CHANGED: id → _id
        name: user.name,
        email: user.email,
        role: user.role,
        customerId: user.customerId
      }))
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});

// Debug route to check all bookings
app.get("/api/debug/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    console.log("📊 All bookings in database:", bookings.length);
    res.json({ 
      totalBookings: bookings.length,
      bookings: bookings.map(booking => ({
        _id: booking._id,     // ✅ CHANGED: id → _id
        bookingId: booking.bookingId,
        userId: booking.userId,
        gameName: booking.gameName,
        bookingDate: booking.bookingDate,
        startTime: booking.startTime,
        status: booking.status
      }))
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Debug users: http://localhost:${PORT}/api/debug/users`);
  console.log(`📅 Debug bookings: http://localhost:${PORT}/api/debug/bookings`);
});