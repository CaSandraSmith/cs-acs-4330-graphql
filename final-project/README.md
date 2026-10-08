# Hobby Tracker

A full-stack GraphQL app for tracking progress on hobby projects. Add a hobby, add projects to it with a goal and a unit (pieces, hours, chapters, levels), then log sessions to watch your progress climb. 

The UI is styled like a notepad: hobbies are headings on the page, and the projects under them show how far along you are.

## Features

- Add hobbies and group projects under them
- Add projects with a goal, a unit, and an optional starting amount (for projects you began before using the app)
- Log sessions on a project with an amount, date, and optional note
- See each project's total progress and percent complete
- Click a project to see its details and full session history
- Loading and error states on every page and form

## Getting started

You need Node.js installed. Run the server and the client in two separate terminals.

### Server

```bash
cd server
npm install
npm start
```

The server runs at `http://localhost:4000`.

### Client

```bash
cd client
npm install
npm run dev
```

Vite prints the local address (usually `http://localhost:5173`). The client expects the server to be running on port 4000.

### How progress works

`totalProgress` and `percentComplete` are stored on each project and updated by the mutations:

- `addProject` sets `totalProgress` to the starting amount (or 0) and calculates `percentComplete` as `totalProgress / goal`
- `addSession` adds the session's `amount` to `totalProgress` and recalculates `percentComplete`

`percentComplete` is a fraction (0.6 means 60%). The client rounds it to a whole percent and caps the display at 100%.