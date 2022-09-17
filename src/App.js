import { useState, useEffect } from 'react'
import axios from 'axios'

const DisplayWeatherData = ({ country, weatherDetails }) => {
  // return if no weather details are provided
  if (weatherDetails.length === 0) return
  weatherDetails = weatherDetails[0]

  // return weather details
  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <p>temperature {weatherDetails.main.temp - 273.15} kelvin</p>
      <img src={`http://openweathermap.org/img/wn/${weatherDetails.weather[0].icon}@2x.png`} alt="weather icon" />
      <p>wind {weatherDetails.wind.speed} m/s</p>
    </div>
  )
}

const DisplayCountryData = ({ country, weatherDetails }) => {
  return (
    <div key={country.cca2}>
      <h1>{country.name.common}</h1>
      <div>capital: {country.capital}</div>
      <div>area: {country.area}</div>

      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => {
          return <li key={language}> {language} </li>
        })}
      </ul>

      <div>
        <img src={country.flags.png} alt="country flag" />
      </div>

      <DisplayWeatherData country={country} weatherDetails={weatherDetails} />
    </div>
  )
}

const DisplaySingleList = ({ country, onClick }) => {
  return (
    <div>
      <pre key={country.cca2}>
        {country.name.common}{' '}
        <span>
          <button
            onClick={() => {
              onClick({ country })
            }}
          >
            show
          </button>
        </span>
      </pre>
    </div>
  )
}

const DisplayWarning = () => {
  return <div>Too many matches, specify another filter</div>
}

const DisplayHandler = ({ countries, onClick, isCountryView, weatherDetails }) => {
  // show country view
  if (isCountryView) {
    return (
      <>
        {countries.map((country) => {
          return (
            <>
              <DisplayCountryData country={country} weatherDetails={weatherDetails} />
            </>
          )
        })}
      </>
    )
  }

  // show warning if countries are eleven+
  if (countries.length > 10) {
    return <DisplayWarning />
  }

  // show list of matching countries
  return (
    <>
      {countries.map((country) => {
        return <DisplaySingleList key={country.cca2} country={country} onClick={onClick} />
      })}
    </>
  )
}

const Filter = ({ onChange }) => {
  return (
    <div>
      find countries <input onChange={onChange} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState({ isEmpty: true, query: '' })
  const [click, setClick] = useState([])
  const [showCountryView, setShowCountryView] = useState(false)
  const [latLng, setLatLng] = useState([])
  const [weatherReport, setWeatherReport] = useState([])

  const filterListing = (e) => {
    setClick([])
    setShowCountryView(false)
    const len = e.target.value.length
    if (len === 0) {
      searchQuery.isEmpty = true
    } else {
      searchQuery.isEmpty = false
    }

    const updateQuery = e.target.value
    setSearchQuery({ ...searchQuery, query: updateQuery })
  }

  // when the button is clicked
  const showCountryInfo = (e) => {
    const country = [e.country]
    const { latlng } = country[0].capitalInfo

    setSearchQuery({ ...searchQuery, isEmpty: true })
    setClick(country)
    setShowCountryView(true)
    setLatLng(latlng)
  }

  const setDataToShow = () => {
    return searchQuery.isEmpty
      ? click
      : countries.filter((country) => {
          return country.name.common.toLowerCase().includes(searchQuery.query.toLowerCase())
        })
  }

  let dataToShow = setDataToShow()
  // console.log("🚀 ~ line 135 ~ latLng", latLng)
  // console.log("🚀 ~ line 1366 ~ click", click)

  const getWeatherReport = () => {
    // console.log('latLng just changed.', latLng, 'Fetching new weather report...')
    if (latLng.length === 0) return
    // console.log(latLng)
    const lat = latLng[0]
    const lng = latLng[1]
    const API_KEY = process.env.REACT_APP_API_KEY

    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`

    axios.get(URL).then((response) => {
      setWeatherReport([response.data])
      // console.log('⛅', 'weather report set')
    })
  }

  // update the weather report when latLng changes
  useEffect(getWeatherReport, [latLng])

  const hook = () => {
    axios.get('https://restcountries.com/v3.1/all').then((data) => {
      setCountries(data.data)
      // console.log('Country data loaded', '👌')
    })
  }

  useEffect(hook, [])

  return (
    <div>
      <h2>Data for countries</h2>
      <Filter onChange={filterListing} />
      <DisplayHandler countries={dataToShow} onClick={showCountryInfo} isCountryView={showCountryView} weatherDetails={weatherReport} />
    </div>
  )
}

export default App
