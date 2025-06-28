import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
    ident: String,
    departure_date: String,
    data: Object,
    lastUpdated: { type: Date, default: Date.now }
})

flightSchema.index({ ident: 1, departure_date: 1 }, { unique: true })

export default mongoose.model('Flight', flightSchema)