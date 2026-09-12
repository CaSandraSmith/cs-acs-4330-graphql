import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'


// Challenge 1
const moviesList = [
  {title: "Practical Magic 2", genre: "Fantasy", rating: 6.3 },
  {title: "The Runner", genre: "Action", rating: 4.1 },
  {title: "Fall 2: Deadpoint", genre: "Adventure", rating: 5.6 }
]

const typeDefs = `#graphql
    # Challenge 2
    enum Genre {
        Fantasy
        Action
        Adventure
    }

    type Movie {
        title: String!
        genre: Genre!
        rating: Float
    }

    # Challenge 10
    type Time {
        hour: Int!
        minute: Int!
        second: Int!
    }

    # Challenge 12
    type Roll {
        total: Int!
        sides: Int!
        rolls: [Int!]!
    }    

    type Query {
        # Challenge 3
        allMovies: [Movie!]!

        # Challenge 6
        getMovie(index: Int!): Movie
        
        # Challenge 9
        firstMovie: Movie!
        lastMovie: Movie!

        # Challenge 10
        getTime: Time!

        # Challenge 11
        getRandom(range: Int!): Int!

        # Challenge 12
        getRoll(sides: Int!, rolls: Int!): Roll

        # Challenge 13
        getMoviesCount: Int!

        # Challenge 14
        moviesInRange(start: Int!, count: Int!): [Movie!]!

        # Challenge 15
        getMoviesByGenre(genre: Genre!): [Movie!]!

        # Challenge 16
        allGenres: [Genre!]!
    }
`


const resolvers = {
  Query: {
    // Challenge 4
    allMovies: () => {
      return moviesList
    },
    // Challenge 7
    getMovie: (_, {index}) => {
        return moviesList[index]
    },
    // Challenge 9
    firstMovie: () => {
        return moviesList[0]
    },
    lastMovie: () => {
        return moviesList[moviesList.length - 1]
    },
    // Challenge 10
    getTime: () => {
        const time = new Date()
        return {
            hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds()
        }
    },
    // Challenge 11
    getRandom: (_, {range}) => {
        return Math.floor(Math.random() * (range + 1))
    },
    // Challenge 12
    getRoll: (_, {sides, rolls}) => {
        const rollsArr = []
        let total = 0
        for (let i = 0; i < rolls; i++) {
            const rollResult = Math.floor(Math.random() * sides) + 1
            rollsArr.push(rollResult)
            total += rollResult
        }
        return {
            total,
            sides,
            rolls: rollsArr
        }
    },
    // Challenge 13
    getMoviesCount: () => {
        return moviesList.length
    },
    // Challenge 14
    moviesInRange: (_, {start, count}) => {
        return moviesList.slice(start, start + count)
    },
    // Challenge 15
    getMoviesByGenre: (_, {genre}) => {
        return moviesList.filter(movie => movie.genre === genre)
    },
    // Challenge 16
    allGenres: () => {
        return moviesList.reduce((genres, movie) => {
            const currentGenre = movie.genre
            if (!genres.includes(currentGenre)) genres.push(currentGenre)
            return genres

        }, [])
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)
