import { useState, useEffect } from "react"
import axios from "axios"

const DisplaySingleList = ({ country }) => {
  return (
    <div>
      {country.name.common}
    </div>
  )
}

const DisplayWarning = () => {

  return <div>Too many matches, specify another filter</div>
}

const DisplayHandler = ({countries}) => {
  if (countries.length > 10) {
    return <DisplayWarning/>
  }
  
  return (
    <>
      {countries.map((country) => {
        return <DisplaySingleList key={country.cca2} country={country}/>
      })}
    </>
  )
}

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
    if (len === 0) {
      searchQuery.isEmpty = true
    } else {
      searchQuery.isEmpty = false
    }

    const updateQuery = e.target.value
    setSearchQuery({ ...searchQuery, query: updateQuery })
  }

  const setDataToShow = () => {
    return searchQuery.isEmpty
    ? []
    : countries.filter((country) => {
        return country.name.common.toLowerCase().includes(searchQuery.query.toLowerCase())
      })
  }

  let dataToShow = setDataToShow()

  return (
    <div>
      <h2>Data for countries</h2>
      <Filter onChange={filterListing} />
      <DisplayHandler countries={dataToShow} />
    </div>
  )
}

export default App
