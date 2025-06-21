import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
    ident: String,
    data: Object,
    lastUpdated: { type: Date, default: Date.now }
})

export default mongoose.model('Flight', flightSchema)