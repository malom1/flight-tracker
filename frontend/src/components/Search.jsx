import { useState } from "react"

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
            setFlightData(null)
            alert("Flight not found")
        }
    }
    
    return(
        <div className="search">
            <form onSubmit={handleSubmit}>
                <h2>Search for a flight</h2>
                <h3>Flight Number: </h3>
                <input 
                    type="text"
                    value={flightNumber}
                    onChange={e => setFlightNumber(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            { flightData && (
                <pre>{JSON.stringify(flightData, null, 2)}</pre>
            )}
        </div>
    )
}