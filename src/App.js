import { useState, useEffect } from "react"
import axios from "axios"

const Filter = ({onChange}) => {
  return (
    <div>
      find countries <input onChange={onChange} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState({isEmpty: true, query: ''})

  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(data => {
        setCountries(data.data)
      })
  }

  useEffect(hook, [])

  const filterListing = (e) => {
    const len = e.target.value.length
    console.log(len)
    if (len === 0) {
      searchQuery.isEmpty = true
    } else {
      searchQuery.isEmpty = false
    }

    const updateQuery = e.target.value
    setSearchQuery({ ...searchQuery, query: updateQuery })
  }

  const dataToShow = searchQuery.isEmpty
    ? []
    : countries.filter((country) => {
        return country.name.common.toLowerCase().includes(searchQuery.query.toLowerCase())
      })

  return (
    <div>
      <h2>Data for countries</h2>
      <Filter onChange={filterListing} />
      {dataToShow.map((country) => {
        return <div>{country.name.common}</div>
      })}
    </div>
  )
}

export default App
