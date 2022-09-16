import { useState, useEffect } from "react"
import axios from "axios"

const App = () => {
  const [countries, setCountries] = useState([])

  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(data => {
        setCountries(data.data)
      })
  }

  useEffect(hook, [])

  console.log(countries)

  return (
    <div>
      <h2>Data for countries</h2>
      <ul>
      {countries.map(country => {
          return <li>{country.name.common}</li>
        })}
      </ul>
    </div>
  )
}

export default App
