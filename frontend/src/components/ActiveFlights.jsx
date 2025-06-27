import { useCallback, useEffect, useState, useRef } from "react"
import Card from "./Card"
import '../styles/ActiveFlights.css'

export default function ActiveFlights() {
    const flightNums = ["HA50", "AI119", "SQ24", "EY3", "KQA02", "PR126"]
    const [activeFlights, setActiveFlights] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)

    const isReqInProgress = useRef(false)
    const abortControllerRef = useRef(null)

    const fetchFlights = useCallback(async() => {
        if (isReqInProgress.current) {
            console.log('Request already in progress, skipping..')
            return
        }

        isReqInProgress.current = true
        setError(null)

        // Abort any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        try {
            console.log('Fetching flights...')

            const results = []
            for (const num of flightNums) {
                try {
                    const res = await fetch(`http://localhost:3000/api/flight/${num}`, {
                        signal: abortControllerRef.current.signal
                    })

                    if (res.ok) {
                        const data = await res.json()

                        if (data) {
                            results.push(data)
                        }
                    } else if (res.status === 404) {
                        console.log(`Flight ${num} is not active`)
                    } else {
                        console.warn(`Failed to fetch ${num}: ${res.status}`)
                    }
                } catch (fetchError) {
                    if (fetchError.name === 'AbortError') {
                        console.log('Request Aborted')
                        return
                    }
                    console.error(`Error fetching ${num}: `, fetchError)
                }

                // Add delay between requests to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 100))
            }

            setActiveFlights(results)
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

        // Set up interval for periodic updates (10 minutes)
        // intervalId = setInterval(fetchFlights, 10 * 60 * 1000)

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
                    No active flights found
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