import { useState, useEffect } from "react"
import axios from "axios"

const DisplayCountryData = ({country}) => {

  return (
    <div>
      <h1>{ country.name.common }</h1>
      <div>capital: { country.capital }</div>
      <div>area: { country.area }</div>

      <h3>Languages:</h3>
      <ul>
      {Object.values(country.languages).map(language => {
        return <li key={language}> {language} </li>
      })}
      </ul>

      <div>
        <img src={country.flags.png} alt="country flag" />
      </div>
    </div>
  )

}

const DisplaySingleList = ({ country, onClick }) => {
  return (
    <div>
      <pre>
      {country.name.common} <span><button datatype={country.cca2} onClick={ () => { onClick({country})} } >show</button></span>
      </pre>
    </div>
  )
}

const DisplayWarning = () => {

  return <div>Too many matches, specify another filter</div>
}

const DisplayHandler = ({countries, onClick}) => {
  if (countries.length === 1) {
    return (
      <>
        {countries.map((country) => {
          return <DisplayCountryData key={country.cca2} country={country} />
        })}
      </>
    )
  }

  if (countries.length > 10) {
    return <DisplayWarning/>
  }

  
  return (
    <>
      {countries.map((country) => {
        return <DisplaySingleList key={country.cca2} country={country} onClick={onClick}/>
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
  const [click, setClick] = useState([])

  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(data => {
        setCountries(data.data)
      })
  }

  useEffect(hook, [])

  const filterListing = (e) => {
    setClick([])
    const len = e.target.value.length
    if (len === 0) {
      searchQuery.isEmpty = true
    } else {
      searchQuery.isEmpty = false
    }

    const updateQuery = e.target.value
    setSearchQuery({ ...searchQuery, query: updateQuery })
  }

  const showCountryInfo = (e) => {
    const country = [e.country]
    
    setSearchQuery({ ...searchQuery, isEmpty: true})
    setClick(country)
  }

  const setDataToShow = () => {
    return searchQuery.isEmpty
    ? click
    : countries.filter((country) => {
        return country.name.common.toLowerCase().includes(searchQuery.query.toLowerCase())
      })
  }

  let dataToShow = setDataToShow()

  return (
    <div>
      <h2>Data for countries</h2>
      <Filter onChange={filterListing} />
      <DisplayHandler countries={dataToShow} onClick={showCountryInfo}/>
    </div>
  )
}

export default App
