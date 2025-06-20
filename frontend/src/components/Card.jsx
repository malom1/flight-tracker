// import { useState } from "react";

export default function Card({flight}) {

    if (!flight) {
        return null
    }

    // const [flightNum, setFlightNum] = useState(null)
    // const [acType, setAcType] = useState("")
    // const [acRegistration, setAcRegistration] = useState("")
    // const [origin, setOrigin] = useState("")
    // const [etd, setEtd] = useState("")
    // const [destination, setDestination] = useState("")
    // const [eta, setEta] = useState("")

    return(
        <div className="card">
            <div className="flight-info">
                <h4>Flight Number: {flight.ident}</h4>
                <h6>Aircraft Type: {flight.aircraft_type}</h6>
                <h6>Aircraft Registration: {flight.registration}</h6>
            </div>
            <div className="origin-info">
                <h6>Origin: {flight.origin.code_iata}</h6>
                <h6>ETD: {flight.actual_off}</h6>
            </div>
            <div className="destination-info">
                <h6>Destination: {flight.destination.code_iata}</h6>
                <h6>ETA: {flight.estimated_in}</h6>
            </div>
        </div>
    )
}