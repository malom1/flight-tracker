import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
    ident: { type: String, required: true },
    departure_date: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    lastUpdated: { type: Date, default: Date.now }
})

flightSchema.index({ ident: 1, departure_date: 1 }, { unique: true })

export default mongoose.model('Flight', flightSchema)
