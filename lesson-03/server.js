import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import 'dotenv/config'

const apikey = process.env.OPENWEATHERMAP_API_KEY


const typeDefs = `#graphql
    type Weather {
        temperature: Float
        description: String
        feels_like: Float
        temp_min: Float
        temp_max: Float
        pressure: Int
        humidity: Int
        cod: Int
        message: String
        name: String
    }
    
    enum Units {
        standard
        metric
        imperial
    }

    type Query {
        getWeather(zip: Int!, units: Units): Weather!
        getWeatherByLocation(lat: Float!, lon: Float!, units: Units): Weather!
    }
`

const resolvers = {
  Query: {
    getWeather: async (_, { zip, units = 'imperial' }) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apikey}&units=${units}`
      const res = await fetch(url)
      const json = await res.json()

      if (!json.main) {
        return {
            message: json?.message,
            cod: Number(json?.cod)
        }
      }

      return { 
            temperature: json.main.temp,
            feels_like: json.main.feels_like,
            temp_min: json.main.temp_min,
            temp_max: json.main.temp_max,
            pressure: json.main.pressure,
            humidity: json.main.humidity,
            description: json.weather[0].description,
            name: json.name,
            cod: Number(json?.cod)
        }
    },
    getWeatherByLocation: async (_, { lat, lon, units = 'imperial' }) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=${units}`
      const res = await fetch(url)
      const json = await res.json()

      if (!json.main) {
        return {
            message: json?.message,
            cod: Number(json?.cod)
        }
      }

      return { 
            temperature: json.main.temp,
            feels_like: json.main.feels_like,
            temp_min: json.main.temp_min,
            temp_max: json.main.temp_max,
            pressure: json.main.pressure,
            humidity: json.main.humidity,
            description: json.weather[0].description,
            name: json.name,
            cod: Number(json?.cod)
        }
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)