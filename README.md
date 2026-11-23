# Joshi LMS

A responsive Learning Management System built with React, Vite, Express and MongoDB.

> **Engineering signal:** a full-stack student workflow that connects searchable learning content, validated registration, CRUD APIs, and responsive delivery in one practical system.

## Features

- Course search, filtering and sorting
- Course details dialog and enquiry form
- Student registration with validation and photo preview
- Local object CRUD with localStorage
- REST API and MongoDB student CRUD
- Node.js file-system article CRUD
- Responsive layout for mobile, tablet and desktop

## Lab 8 — RESTful Services

Student CRUD REST API using Express, MongoDB and Mongoose with GET, POST, PUT and DELETE operations.

## Quality and validation loop

The project is validated as a workflow, not only as a UI:

1. **Input validation** — verify required student fields and reject malformed requests.
2. **CRUD contract** — confirm GET, POST, PUT and DELETE responses for the student resource.
3. **Persistence check** — verify that MongoDB writes can be read back after the request completes.
4. **Regression pass** — retest course filtering, enquiry flow, local CRUD and responsive layouts after API changes.
5. **Evidence** — record the endpoint, expected result and observed result for repeatable review.

Suggested API smoke checks:

| Endpoint | Method | Expected signal |
| --- | --- | --- |
| `/api/students` | GET | Returns the student collection |
| `/api/students` | POST | Creates a validated student |
| `/api/students/:id` | PUT | Updates an existing student |
| `/api/students/:id` | DELETE | Removes the selected student |

## Tech stack

- React and Vite
- Tailwind CSS
- Axios
- Node.js and Express
- MongoDB and Mongoose

## Run locally

```bash
npm install
npm run dev
```

Frontend: `http://127.0.0.1:5173`

APIs: `http://localhost:5000/api/students` and `http://localhost:5000/api/articles`

Copy `.env.example` to `.env` before starting the MongoDB API.

## Links

- [Live site](https://joshi-lms-react.vercel.app)
- [GitHub repository](https://github.com/Lokrajjoshi/joshi-lms-react)
