import { useEffect, useState } from "react"
import Card from "./Card"

export default function ActiveFlights() {

    const flightNums = ["HA50", "EY1", "OZ222", "AI102", "SQ24", "EY3"]
    const [activeFlights, setActiveFlights] = useState([])

    useEffect(() => {
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
        }
        fetchFlights()
    }, [])
    

    return(
        <div className="active-flights">
            <h2>Active Flights</h2>
            {activeFlights.length === 0 && <div>No active flights</div>}
            {activeFlights.map(flight => (
                <Card key={flight.ident} flight = {flight}/>
            ))}
        </div>
    )
}