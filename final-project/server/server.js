import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'


let hobbies = [
  { id: "1", name: "Puzzles" },
  { id: "2", name: "Video Games" },
  { id: "3", name: "Reading" },
];

let projects = [
  { id: "1", name: "Lighthouse puzzle", hobbyId: "1", unit: "pieces", goal: 1000, totalProgress: 600 },
  { id: "2", name: "Elden Ring", hobbyId: "2", unit: "hours", goal: 60, totalProgress: 7 },
  { id: "3", name: "Dune", hobbyId: "3", unit: "chapters", goal: 48, totalProgress: 5 },
];

let sessions = [
  { id: "1", projectId: "1", amount: 200, date: "2026-10-01", note: "Finished the border" },
  { id: "2", projectId: "1", amount: 250, date: "2026-10-02", note: null },
  { id: "3", projectId: "1", amount: 150, date: "2026-10-03", note: "Sky is tough" },
  { id: "4", projectId: "2", amount: 1.5, date: "2026-10-01", note: null },
  { id: "5", projectId: "2", amount: 5.5, date: "2026-10-02", note: "Beat the first boss" },
  { id: "6", projectId: "3", amount: 5, date: "2026-10-03", note: null },
];


const typeDefs = `#graphql
type Hobby {
  id: ID!
  name: String!
  projects: [Project!]!
}

enum Unit {
    hours
    chapters
    pieces
    levels
}

type Project {
  id: ID!
  name: String!
  hobby: Hobby!
  unit: Unit!
  goal: Float!
  percentComplete: Float!
  totalProgress: Float!
  sessions: [Session!]!
}

type Session {
  id: ID!
  project: Project!
  amount: Float!
  date: String!
  note: String
}

type Query {
  hobbies: [Hobby!]!
  hobby(id: ID!): Hobby
  project(id: ID!): Project
}

type Mutation {
  addHobby(name: String!): Hobby
  addProject(name: String!, hobbyId: ID!, unit: Unit!, goal: Float!, totalProgress: Float): Project
  addSession(projectId: ID!, amount: Float!, date: String!, note: String): Session
}
`


const resolvers = {
  Query: {
    hobbies: () => hobbies,
    hobby: (_, {id}) => hobbies.find(hobby => hobby.id === id),
    project: (_, {id}) => projects.find(project => project.id === id)
  },
  Hobby: {
    projects: (parent) => {
        return projects.filter(project => project.hobbyId === parent.id)
    }
  },
  Project: {
    hobby: (parent) => {
        return hobbies.find(hobby => hobby.id === parent.hobbyId)
    },
    sessions: (parent) => {
        return sessions.filter(session => session.projectId === parent.id)
    }
  },
  Session: {
    project: (parent) => {
        return projects.find(project => project.id === parent.projectId)
    }
  },
  Mutation: {
    addHobby: (_, {name}) => {
        const hobby = {name}
        hobby.id = String(Number(hobbies[hobbies.length - 1].id) + 1)
        hobbies.push(hobby)
        return hobby
    },
    addProject: (_, {name, hobbyId, unit, goal, totalProgress}) => {
        const hobby = hobbies.find(hobby => hobby.id === hobbyId)
        if (!hobby) return null
        const project = {name, hobbyId, unit, goal, totalProgress: totalProgress ?? 0}
        project.id = String(Number(projects[projects.length - 1].id) + 1)
        projects.push(project)
        return project
    },
    addSession: (_, {projectId, amount, date, note}) => {
        const project = projects.find(project => project.id === projectId)
        if (!project) return null
        const session = {projectId, amount, date, note: note ?? null}
        session.id = String(Number(sessions[sessions.length - 1].id) + 1)
        sessions.push(session)
        project.totalProgress += amount
        return session
    }
}
}

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)
