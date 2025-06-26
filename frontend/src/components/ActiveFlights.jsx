import { useEffect, useState } from "react"
import Card from "./Card"

export default function ActiveFlights() {

    const flightNums = ["HA50", "AI119", "SQ24", "EY3"]
    const [activeFlights, setActiveFlights] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let intervalId

        // Search through the list and find the active flights
        async function fetchFlights() {
            const results = await Promise.all(
                flightNums.map(async(num) => {
                    const res = await fetch(`http://localhost:3000/api/flight/${num}`)
                    if (res.ok) {
                        const data = res.json()
                        return data
                    }
                    return null
                })
            )
            setActiveFlights(results.filter(Boolean)) // Remove nulls (Non-active flights)
            setLoading(false)
        }
        fetchFlights()

        intervalId = setInterval(fetchFlights, 60 * 10000) // every minute

        return () => clearInterval(intervalId)
    }, [])
    

    return(
        <div className="flight-card">
            <h2>Active Flights</h2>
            {loading && <div className="loading">Loading...</div>}
            {activeFlights.length === 0 && !loading && <div>No active flights</div>}
            {activeFlights.map(flight => (
                <Card key={flight.ident} flight = {flight}/>
            ))}
        </div>
    )
}