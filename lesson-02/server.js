import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const typeDefs = `#graphql
  type About {
    message: String!
  }

  type Meal {
    description: String!
  }

  enum MealTime {
    breakfast
    lunch 
    dinner
  }

  type Pet {
    name: String!
    species: String!
  }

  type Query {
    getAbout: About
    getmeal(time: MealTime!): Meal
    getPet(id: Int!): Pet # Add a query to get a single pet
    allPets: [Pet!]! # Returns an array of type Pet
  }
`

// Mock datatbase in this case:
const petList = [
  { name: 'Fluffy', species: 'Dog' },
  { name: 'Sassy', species: 'Cat' },
  { name: 'Goldberg', species: 'Frog' }
]

const resolvers = {
  Query: {
    getAbout: () => {
      return { message: 'Hello World' }
    },
    getmeal: (_, { time }) => {
      const allMeals = { breakfast: 'toast', lunch: 'noodles', dinner: 'pizza' }
      return { description: allMeals[time] }
    },
    getPet: (_, { id }) => {
      return petList[id]
    },
    allPets: () => {
      return petList
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)
