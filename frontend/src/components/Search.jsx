import { useState } from "react"
import '../styles/Search.css'
import Card from "./Card"

export default function Search() {

    const [flightNumber, setFlightNumber] = useState("")
    const [flightData, setFlightData] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        const res = await fetch(`http://localhost:3000/api/flight/${flightNumber}`)
        if (res.ok) {
            const data = await res.json()
            setFlightData(data)
        } else {
            setFlightData(`Flight not found`)
        }
    }
    
    return(
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-box">
                <h3>Flight Number: </h3>
                <input
                    type="text"
                    value={flightNumber}
                    onChange={e => setFlightNumber(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            {
                typeof flightData === "string"
                ? <div>{flightData}</div>
                : flightData && <Card flight = {flightData} />
            }
        </div>
    )
}