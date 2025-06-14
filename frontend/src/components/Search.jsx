import { useState } from "react"

export default function Search() {

    const [flightNumber, setFlightNumber] = useState("")

    
    return(
        <div className="search">
            <form>
                <h2>Search for a flight</h2>
                <h3>Flight Number: </h3>
                <input 
                    type="text"
                    value={flightNumber}
                    onChange={e => setFlightNumber(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}