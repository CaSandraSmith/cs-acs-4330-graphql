# Final project proposal

## 1. What your app does (one sentence)

A hobby tracker that lets users log their progress on hobby projects and browse by hobby category.

## 2. Types and fields

```
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
```

## 3. Relationships

* Hobby → [Project] (a hobby has many projects)
* Project → Hobby (a project has one hobby)
* Project → [Session] (a project has many sessions)
* Session → Project (a session has one project)

## 4. Queries

```
type Query {
  hobbies: [Hobby!]!
  hobby(id: ID!): Hobby
  project(id: ID!): Project
}
```

## 5. Mutations

```
type Mutation {
  addHobby(name: String!): Hobby
  addProject(name: String!, hobbyId: ID!, unit: Unit!, goal: Float!, totalProgress: Float): Project
  addSession(projectId: ID!, amount: Float!, date: String!, note: String): Session
}
```