import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/flight/:ident', async (req, res) => {
    const { ident } = req.params
    const API_KEY = process.env.FLIGHTAWARE_API_KEY

    try {
        const response = await axios.get(`https://aeroapi.flightaware.com/aeroapi/flights/${ident}`,
            {
                headers: {
                    'x-apikey': API_KEY
                }
            }
        )
        res.status(200).json(response.data)
    } catch (error) {
        res.status(error.response?.status)
        console.error('Error fetching data: ', error)
    }
})

app.listen(PORT, () => [
    console.log(`Server is running on PORT: ${PORT}`)
])

