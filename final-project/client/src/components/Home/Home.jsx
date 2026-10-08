import { useState } from 'react'
import { Link } from 'react-router'
import { gql, useQuery, useMutation } from '@apollo/client'
import './Home.css'

const GET_HOBBIES = gql`
    query Hobbies {
        hobbies {
            id
            name
            projects {
                id
                name
                percentComplete
            }
        }
    }
`

const ADD_HOBBY = gql`
    mutation AddHobby($name: String!) {
        addHobby(name: $name) {
            id
            name
        }
    }
`

const ADD_PROJECT = gql`
    mutation AddProject($name: String!, $hobbyId: ID!, $unit: Unit!, $goal: Float!, $totalProgress: Float) {
        addProject(name: $name, hobbyId: $hobbyId, unit: $unit, goal: $goal, totalProgress: $totalProgress) {
            id
            name
        }
    }
`

const UNITS = ['hours', 'chapters', 'pieces', 'levels']

export default function Home() {
    const [hobbyName, setHobbyName] = useState('')

    const [hobbyId, setHobbyId] = useState('')
    const [projectName, setProjectName] = useState('')
    const [goal, setGoal] = useState('')
    const [unit, setUnit] = useState(UNITS[0])
    const [done, setDone] = useState('')

    const { loading, error, data } = useQuery(GET_HOBBIES)

    const [addHobby, { loading: addingHobby, error: addHobbyError }] = useMutation(ADD_HOBBY, {
        refetchQueries: ['Hobbies'],
        onCompleted: () => setHobbyName(''),
        onError: () => {},
    })

    const [addProject, { loading: addingProject, error: addProjectError }] = useMutation(ADD_PROJECT, {
        refetchQueries: ['Hobbies'],
        onCompleted: () => {
            setProjectName('')
            setGoal('')
            setDone('')
        },
        onError: () => {},
    })

    const handleHobbySubmit = (e) => {
        e.preventDefault()
        const trimmed = hobbyName.trim()
        if (!trimmed) return
        addHobby({ variables: { name: trimmed } })
    }

    const parsedGoal = parseFloat(goal)
    const parsedDone = parseFloat(done)
    const projectValid = hobbyId && projectName.trim() && parsedGoal > 0

    const handleProjectSubmit = (e) => {
        e.preventDefault()
        if (!projectValid) return
        addProject({
            variables: {
                name: projectName.trim(),
                hobbyId,
                unit,
                goal: parsedGoal,
                totalProgress: Number.isNaN(parsedDone) ? null : parsedDone,
            },
        })
    }

    if (loading) return <p className="pad-status">Loading ...</p>
    if (error) return <p className="pad-status">Couldn't load your hobbies: {error.message}</p>

    return (
        <main className="pad">
            <h1 className="pad-title">My hobbies</h1>

            <h2 className="pad-line form-label">Add a hobby</h2>
            <form className="pad-line hobby-form" onSubmit={handleHobbySubmit}>
                <input
                    className="hobby-input"
                    type="text"
                    value={hobbyName}
                    onChange={(e) => setHobbyName(e.target.value)}
                    placeholder="New hobby"
                    aria-label="New hobby name"
                />
                <button className="hobby-add" type="submit" disabled={addingHobby || !hobbyName.trim()}>
                    {addingHobby ? 'Adding ...' : 'Add hobby'}
                </button>
            </form>
            {addHobbyError && <p className="pad-line pad-error">Couldn't add hobby: {addHobbyError.message}</p>}

            <h2 className="pad-line form-label">Add a project</h2>
            <form onSubmit={handleProjectSubmit}>
                <div className="pad-line hobby-form">
                    <select
                        className="hobby-input hobby-select"
                        value={hobbyId}
                        onChange={(e) => setHobbyId(e.target.value)}
                        aria-label="Hobby for the new project"
                    >
                        <option value="">Choose hobby</option>
                        {data.hobbies.map((hobby) => (
                            <option key={hobby.id} value={hobby.id}>
                                {hobby.name}
                            </option>
                        ))}
                    </select>
                    <input
                        className="hobby-input"
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="New project"
                        aria-label="New project name"
                    />
                </div>
                <div className="pad-line hobby-form">
                    <input
                        className="hobby-input small-input"
                        type="number"
                        min="0"
                        step="any"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Goal"
                        aria-label="Goal"
                    />
                    <select
                        className="hobby-input unit-select"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        aria-label="Unit"
                    >
                        {UNITS.map((u) => (
                            <option key={u} value={u}>
                                {u}
                            </option>
                        ))}
                    </select>
                    <input
                        className="hobby-input"
                        type="number"
                        min="0"
                        step="any"
                        value={done}
                        onChange={(e) => setDone(e.target.value)}
                        placeholder="Done so far"
                        aria-label="Progress already made (optional)"
                    />
                    <button className="hobby-add" type="submit" disabled={addingProject || !projectValid}>
                        {addingProject ? 'Adding ...' : 'Add project'}
                    </button>
                </div>
            </form>
            {addProjectError && (
                <p className="pad-line pad-error">Couldn't add project: {addProjectError.message}</p>
            )}

            {data.hobbies.length === 0 && (
                <p className="pad-line">No hobbies yet. Add one above to start your list.</p>
            )}

            {data.hobbies.map((hobby) => (
                <section key={hobby.id}>
                    <h2 className="pad-line hobby-name">{hobby.name}</h2>
                    <ul className="projects">
                        {hobby.projects.map((project) => (
                            <li key={project.id} className="pad-line project">
                                <Link to={`/project/${project.id}`} className="project-link">
                                    <span>– {project.name}</span>
                                    <span className="project-percent">
                                        {Math.round(Math.min(project.percentComplete, 1) * 100)}%
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </main>
    )
}