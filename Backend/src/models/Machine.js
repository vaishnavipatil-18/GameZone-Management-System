import mongoose from "mongoose";

const machineSchema = new mongoose.Schema({
    machineId: {
        type: String,
        required: [true, 'Machine ID is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Machine name is required'],
        trim: true
    },
    gameId: {
        type: String,
        default: ''
    },
    gameName: {
        type: String,
        default: 'No Game Assigned'
    },
    status: {
        type: String,
        enum: ['Available', 'Under Maintenance', 'Out of Service', 'Reserved', 'In Use'],
        required: [true, 'Status is required'],
        default: 'Available'
    },
    maintenanceInfo: {
        type: String,
        default: 'No issues reported'
    },
    lastMaintenance: {
        type: Date
    },
    nextMaintenance: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model('Machine', machineSchema);