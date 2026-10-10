import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: [true, 'Booking ID is required'],
        unique: true,
        trim: true
    },
    userId: {
        type: String,  // CHANGED: From ObjectId to String to accept custom IDs like "user123"
        required: [true, 'User ID is required']
    },
    userName: {
        type: String,
        required: [true, 'User name is required']
    },
    userEmail: {
        type: String,
        required: [true, 'User email is required']
    },
    gameId: {
        type: String,
        required: [true, 'Game ID is required']
    },
    gameName: {
        type: String,
        required: [true, 'Game name is required']
    },
    machineId: {
        type: String,
        default: ''
    },
    bookingDate: {
        type: Date,
        required: [true, 'Booking date is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 hour']
    },
    totalCost: {
        type: Number,
        required: [true, 'Total cost is required'],
        min: [0, 'Cost cannot be negative']
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'No Show'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['online', 'counter', 'wallet'],
        required: [true, 'Payment method is required']
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded', 'Failed'],
        default: 'Pending'
    },
    transactionId: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Generate booking ID before saving
bookingSchema.pre('save', function(next) {
    if (!this.bookingId) {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(1000 + Math.random() * 9000);
        this.bookingId = `BKG${timestamp}${random}`;
    }
    next();
});

export default mongoose.model('Booking', bookingSchema);