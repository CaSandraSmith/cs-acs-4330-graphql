import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'


// Challenge 1
let moviesList = [
  {id: 1, title: "Practical Magic 2", genre: "Fantasy", rating: 6.3 },
  {id: 2, title: "The Runner", genre: "Action", rating: 4.1 },
  {id: 3, title: "Fall 2: Deadpoint", genre: "Adventure", rating: 5.6 }
]

let booksList = [
    {id: 1, title: "Atomic Habits", author: "James Clear", isbn: 9780735211292},
    {id: 2, title: "Dear Debbie", author: "Freida McFadden", isbn: 9781464264832},
    {id: 3, title: "A Tale of Two Cities", author: "Charles Dickens", isbn: null}
]

const typeDefs = `#graphql
    enum Genre {
        Fantasy
        Action
        Adventure
    }

    type Movie {
        id: ID!
        title: String!
        genre: Genre!
        rating: Float
    }

    type Time {
        hour: Int!
        minute: Int!
        second: Int!
    }

    type Roll {
        total: Int!
        sides: Int!
        rolls: [Int!]!
    }
    
    type Book {
        id: ID!
        title: String!
        author: String!
        isbn: Int
    }

    type Query {
        allMovies: [Movie!]!
        getMovie(index: Int!): Movie
        firstMovie: Movie!
        lastMovie: Movie!
        getTime: Time!
        getRandom(range: Int!): Int!
        getRoll(sides: Int!, rolls: Int!): Roll
        getMoviesCount: Int!
        moviesInRange(start: Int!, count: Int!): [Movie!]!
        getMoviesByGenre(genre: Genre!): [Movie!]!
        allGenres: [Genre!]!
        getMovieById(id: Int!): Movie
        books: [Book!]!
    }

    type Mutation {
        addMovie(title: String!, genre: Genre!, rating: Float): Movie!
        updateMovie(id: Int!, title: String, genre: Genre, rating: Float): Movie
        deleteMovie(id: Int!): Movie
        addBook(title: String!, author: String!, isbn: Int): Book!
        editBook(id: Int!, title: String, author: String, isbn: Int): Book
        deleteBook(id: Int!): Book
    }
`


const resolvers = {
  Query: {
    allMovies: () => {
      return moviesList
    },
    getMovie: (_, {index}) => {
        return moviesList[index]
    },
    firstMovie: () => {
        return moviesList[0]
    },
    lastMovie: () => {
        return moviesList[moviesList.length - 1]
    },
    getTime: () => {
        const time = new Date()
        return {
            hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds()
        }
    },
    getRandom: (_, {range}) => {
        return Math.floor(Math.random() * (range + 1))
    },
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
    getMoviesCount: () => {
        return moviesList.length
    },
    moviesInRange: (_, {start, count}) => {
        return moviesList.slice(start, start + count)
    },
    getMoviesByGenre: (_, {genre}) => {
        return moviesList.filter(movie => movie.genre === genre)
    },
    allGenres: () => {
        return moviesList.reduce((genres, movie) => {
            const currentGenre = movie.genre
            if (!genres.includes(currentGenre)) genres.push(currentGenre)
            return genres

        }, [])
    },
    getMovieById: (_, {id}) => {
        return moviesList.find(movie => movie.id === id)
    },
    books: () => {
        return booksList
    }
  },
  Mutation: {
    addMovie: (_, {title, genre, rating}) => {
        const movie = {title, genre, rating}
        movie.id = moviesList[moviesList.length - 1].id + 1
        moviesList.push(movie)
        return movie
    },
    updateMovie: (_, {id, title, genre, rating}) => {
        const movie = moviesList.find(movie => movie.id === id)
        if (!movie) return null
        movie.title = title ?? movie.title
        movie.genre = genre ?? movie.genre
        movie.rating = rating ?? movie.rating
        return movie
    },
    deleteMovie: (_, {id}) => {
        let removedMovie
        moviesList = moviesList.filter(movie => {
            if (movie.id === id) {
                removedMovie = movie
                return
            } else return movie
        })
        return removedMovie
    },
    addBook: (_, {title, author, isbn}) => {
        const book = {title, author, isbn}
        book.id = booksList[booksList.length - 1].id + 1
        booksList.push(book)
        return book
    },
    editBook: (_, {id, title, author, isbn}) => {
        const book = booksList.find(book => book.id === id)
        if (!book) return null
        book.title = title ?? book.title
        book.author = author ?? book.author
        book.isbn = isbn ?? book.isbn
        return book
    },
    deleteBook: (_, {id}) => {
        let removedBook
        booksList = booksList.filter(book => {
            if (book.id === id) {
                removedBook = book
                return
            } else return book
        })
        return removedBook
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)
