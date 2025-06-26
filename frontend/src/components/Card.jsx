

export default function Card({flight}) {

    if (!flight) {
        return null
    }

    function formatTime(iso) {
        if (!iso) return "N/A"
        const date = new Date(iso)
        return date.toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            month: "short",
            day: "numeric"
        })
    }

    return(
        <div className="card">
            <div className="card-header">
                <h3>{flight.ident}</h3>
                <span className={`status ${flight.staus?.toLowerCase() || ""}`}>
                    {flight.status || "Unknown"}
                </span>
            </div>
            <div className="card-body">
                <div className="card-section">
                    <strong>Aircraft: </strong> {flight.aircraft_type || "N/A"}
                    <br />
                    <strong>Registration: </strong> {flight.registration}
                </div>
                <div className="card-section">
                    <strong>Origin: </strong> {flight.origin?.code_iata || "N/A"}
                    <br />
                    <strong>ETD: </strong> {formatTime(flight.actual_off || flight.scheduled_off)}
                </div>
                <div className="card-section">
                    <strong>Destination: </strong> {flight.destination?.code_iata || "N/A"}
                    <br />
                    <strong>ETA: </strong> {formatTime(flight.estimated_in || flight.scheduled_in)}
                </div>
            </div>
            <div className="card-footer">
                <strong>Progress: </strong> {flight.progress_percent != null ? `${flight.progress_percent}%` : "N/A"}
            </div>
        </div>
    )
}