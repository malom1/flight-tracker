import { useCallback, useEffect, useState, useRef } from "react"
import Card from "./Card"
import '../styles/ActiveFlights.css'

export default function ActiveFlights() {
    const flightNums = ["HA50", "AI101", "AI119", "SQ24"]
     
                        // "EY3", "EY1", "KQA02", "PR126", 
                        // "HY101", "OZ224", "CK231", "HA1601",
                        // "HA1614", "CSG2545", "CSG2543", "CZ699",
                        //  "QY364", "KU117", "BOX450", "O3181"                   
    const [activeFlights, setActiveFlights] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)

    const isReqInProgress = useRef(false)
    const abortControllerRef = useRef(null)

    const fetchFlights = useCallback(async () => {
        if (isReqInProgress.current) {
            console.log('Request already in progress, skipping...')
            return
        }

        isReqInProgress.current = true
        setError(null)

        const abortController = new AbortController()
        abortControllerRef.current = abortController

        try {
            console.log('Fetching flights...')

            const promises = flightNums.map(num => 
                fetch(`http://localhost:4000/api/flight/${num}`, { signal: abortController.signal })
                    .then(res => res.ok? res.json() : null)
                    .catch(err => {
                        if (err.name == 'AbortController') {
                            console.log('Request aborted')
                            return null
                        }
                        console.error(`Error fetching ${num}: `, err)
                        return null
                    })
            )

            const results = await Promise.allSettled(promises)
            const flights = results
                .filter(r => r.status === 'fulfilled' && r.value)
                .map(r => r.value)

            setActiveFlights(flights)
            setLastUpdated(new Date())
            setLoading(false)
        } catch (error) {
            if (error.name !== 'AbortError') {
                setError(`Failed to fetch flight data: ${error.message}`)
                setLoading(false)
            }
        } finally {
            isReqInProgress.current = false
        }
    }, [])

    useEffect(() => {
        let intervalId

        // Initial fetch
        fetchFlights()

        // Set up interval for periodic updates (60 minutes)
        intervalId = setInterval(fetchFlights, 60 * 60 * 1000)

        // Cleanup function
        return () => {
            clearInterval(intervalId)
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [fetchFlights]) 

    const handleRefresh = () => {
        setLoading(true)
        fetchFlights()
    }

    return(
        <div className="flights-grid">
            <div className="header">
                <h2>Active Flights</h2>
                <div className="controls">
                    <button
                        onClick={handleRefresh}
                        disabled={loading || isReqInProgress.current}
                        className="refresh-btn"
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                    {lastUpdated && (
                        <span className="last-updated">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>

            {error && (
                <div className="error">
                    <span>{error}</span>
                    <button onClick={handleRefresh}>
                        Retry
                    </button>
                </div>
            )}

            {loading && activeFlights.length === 0 && (
                <div className="loading">
                    Loading flight data...
                </div>
            )}

            {!loading && activeFlights.length === 0 && !error && (
                <div className="no-flights">
                    No active flights at the moment
                </div>
            )}

            <div className="flights-container">
                {activeFlights.map((flight, index) => (
                    <Card 
                        key={flight.ident ? `${flight.ident}-${flight.scheduled_off || index}` : `flight-${index}`} 
                        flight={flight}
                    />
                ))}
            </div>

            {activeFlights.length > 0 && (
                <div className="flight-count">
                    Showing {activeFlights.length} active flight{activeFlights.length === 1 ? '' : 's'}
                </div>
            )}
        </div>
    )
}