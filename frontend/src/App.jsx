import Header from "./components/Header"
import Search from "./components/Search"
import ActiveFlights from "./components/ActiveFlights"
import './styles/App.css'

function App() {

  return (
    <div className="container" >
      <Header />
      <Search />
      <ActiveFlights />
    </div>
  )
}

export default App
