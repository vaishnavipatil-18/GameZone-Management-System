import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: [true, 'Game ID is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Game name is required'],
        trim: true
    },
    cost: {
        type: Number,
        required: [true, 'Cost per hour is required'],
        min: [0, 'Cost cannot be negative']
    },
    type: {
        type: String,
        required: [true, 'Game type is required'],
        enum: ['Racing', 'Action', 'Adventure', 'Sports', 'Puzzle', 'Strategy', 'Simulation'],
        trim: true
    },
    maintenanceStatus: {
        type: String,
        enum: ['Operational', 'Maintenance', 'Out of Service', 'Under Repair'],
        default: 'Operational'
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model('Game', gameSchema);