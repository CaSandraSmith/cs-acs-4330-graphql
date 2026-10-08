import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { gql, useQuery, useMutation } from '@apollo/client'
import './Project.css'

const GET_PROJECT = gql`
    query Project($id: ID!) {
        project(id: $id) {
            id
            name
            unit
            goal
            totalProgress
            percentComplete
            hobby {
                id
                name
            }
            sessions {
                id
                date
                amount
                note
            }
        }
    }
`

const ADD_SESSION = gql`
    mutation AddSession($projectId: ID!, $amount: Float!, $date: String!, $note: String) {
        addSession(projectId: $projectId, amount: $amount, date: $date, note: $note) {
            id
            project {
                id
                totalProgress
                percentComplete
            }
        }
    }
`

const toPercent = (fraction) => Math.round(Math.min(fraction, 1) * 100)

const today = () => new Date().toISOString().slice(0, 10)

export default function Project() {
    const { id } = useParams()

    const [amount, setAmount] = useState('')
    const [date, setDate] = useState(today())
    const [note, setNote] = useState('')

    const { loading, error, data } = useQuery(GET_PROJECT, { variables: { id } })

    const [addSession, { loading: adding, error: addError }] = useMutation(ADD_SESSION, {
        refetchQueries: [{ query: GET_PROJECT, variables: { id } }],
        onCompleted: () => {
            setAmount('')
            setNote('')
        },
        onError: () => {},
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const parsed = parseFloat(amount)
        if (Number.isNaN(parsed) || !date) return
        addSession({
            variables: { projectId: id, amount: parsed, date, note: note.trim() || null },
        })
    }

    if (loading) return <p className="pad-status">Loading ...</p>
    if (error) return <p className="pad-status">Couldn't load this project: {error.message}</p>
    if (!data.project) {
        return (
            <p className="pad-status">
                Project not found. <Link to="/">Back to hobbies</Link>
            </p>
        )
    }

    const { project } = data
    const sessions = [...project.sessions].sort((a, b) => b.date.localeCompare(a.date))

    return (
        <main className="pad">
            <Link to="/" className="pad-line back-link">
                ← All hobbies
            </Link>

            <h1 className="pad-title">{project.name}</h1>
            <p className="pad-line">{project.hobby.name}</p>
            <p className="pad-line project-summary">
                {project.totalProgress} / {project.goal} {project.unit} (
                {toPercent(project.percentComplete)}%)
            </p>

            <h2 className="pad-line hobby-name">Log a session</h2>
            <form onSubmit={handleSubmit}>
                <div className="pad-line hobby-form">
                    <input
                        className="hobby-input"
                        type="number"
                        step="any"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Amount (${project.unit})`}
                        aria-label={`Amount in ${project.unit}`}
                    />
                    <input
                        className="hobby-input"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        aria-label="Session date"
                    />
                </div>
                <div className="pad-line hobby-form">
                    <input
                        className="hobby-input"
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Note (optional)"
                        aria-label="Session note"
                    />
                    <button
                        className="hobby-add"
                        type="submit"
                        disabled={adding || Number.isNaN(parseFloat(amount)) || !date}
                    >
                        {adding ? 'Adding ...' : 'Add session'}
                    </button>
                </div>
            </form>
            {addError && <p className="pad-line pad-error">Couldn't add session: {addError.message}</p>}

            <h2 className="pad-line hobby-name">Sessions</h2>
            {sessions.length === 0 && <p className="pad-line">No sessions yet.</p>}
            <ul className="projects">
                {sessions.map((session) => (
                    <li key={session.id} className="pad-line project">
                        <span>
                            – {session.date}
                            {session.note && <span className="session-note">: {session.note}</span>}
                        </span>
                        <span className="project-percent">
                            +{session.amount} {project.unit}
                        </span>
                    </li>
                ))}
            </ul>
        </main>
    )
}