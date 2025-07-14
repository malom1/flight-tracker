import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Flight from './models/Flight.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

//Connect to database
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed: ', err))

const app = express()
const PORT = 3000

app.use('/api', cors(), express.json())

app.get('/api/flight/:ident', async (req, res) => {
    const { ident } = req.params
    const API_KEY = process.env.FLIGHTAWARE_API_KEY

    if (!API_KEY) {
        return res.status(500).json({ message: "Flightaware API not configured" })
    }

    try {

        const recentCachedFlight = await Flight.findOne({
            ident,
            lastUpdated: { $gt: new Date(Date.now() - 60 * 60 * 1000)} // Within the last hour
        }).sort({ lastUpdated: -1})

        if (recentCachedFlight) {
            console.log(`Fetching MONGOOSE data for ${ident}`)
            return res.status(200).json(recentCachedFlight.data)
        }

        console.log(`Making API call for ${ident}`)
        const response = await axios.get(`https://aeroapi.flightaware.com/aeroapi/flights/${ident}`,
            {
                headers: {
                    'x-apikey': API_KEY
                }
            }
        )
        const flights = response.data.flights || []
        const activeFlight = flights.find(flight => flight.progress_percent > 0 && flight.progress_percent < 99)
        
        if (activeFlight) {
            const departureDate = activeFlight.scheduled_off
            ? new Date(activeFlight.scheduled_off).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10)        

            await Flight.findOneAndUpdate(
                { ident: activeFlight.ident, departure_date: departureDate },
                {
                    data: activeFlight, 
                    lastUpdated: new Date(),
                    ident: activeFlight.ident,
                    departure_date: departureDate
                },
                { upsert: true }
            )
            console.log(`Fetching API data ${ident} on ${departureDate}`)
            res.status(200).json(activeFlight)
        } else {
            res.status(404).json({message: "No active flight found"})
        }
    } catch (error) {
        console.error('Error fetching data: ', error)
        const status = error.response?.status || 500
        res.status(status).json({ message: error.message })
    }
})

import history from 'connect-history-api-fallback'
app.use(history())

app.use(express.static(join(__dirname, 'frontend', 'dist')))

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})

