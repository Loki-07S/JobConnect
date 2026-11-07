# JobConnect

JobConnect is a full-stack job networking portal that connects **candidates** with **recruiters**. Candidates can build a profile, browse matching jobs, and apply with a resume. Recruiters can post and manage listings, then review applicants.

The UI is branded as **JobConnect**. The app is split into a React frontend (`client`) and an Express API (`server`) backed by MongoDB.

## Features

### Shared
- Email and password registration and login
- JWT authentication and protected routes
- Role-based navigation (`candidate` or `recruiter`)
- Profile with location, skills, about, LinkedIn, GitHub, and portfolio
- Resume upload (PDF stored on the server)

### Candidates
- Dashboard with recommended jobs based on the role on their profile
- Browse jobs filtered to their target role
- View job details (title, company, location, type, salary, description, requirements)
- Apply once per job using profile and resume data
- Withdraw an application

### Recruiters
- Dashboard with job and applicant counts
- Post jobs (title, company, location, type, salary, description, responsibilities, requirements, website)
- Edit or delete listings
- View applicants for a job, including LinkedIn, GitHub, and resume

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, React Router 6, Axios, Tailwind CSS |
| Backend | Node.js, Express 5, Mongoose, JWT, bcryptjs, Multer |
| Database | MongoDB |
| Auth | JSON Web Tokens (`Authorization: Bearer <token>`) |

## Project Structure

```
job-networking-portal/
├── client/                 # React app (Create React App)
│   └── src/
│       ├── api.js          # Axios client (http://localhost:5000/api)
│       ├── App.js          # Routes and role guards
│       ├── components/     # Sidebar, auth, and layout
│       └── pages/          # Login, dashboard, jobs, profile, applicants
└── server/
    ├── index.js            # Express entry point
    ├── middleware/auth.js  # JWT and role checks
    ├── models/             # User, UserProfile, Job, Application
    ├── routes/             # Auth, jobs, profile, applications
    └── uploads/resumes/    # Uploaded resume files
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Setup

Clone the repository and install dependencies in both apps:

```bash
cd client
npm install

cd ../server
npm install
```

### Environment variables

Create `server/.env` (do not commit this file):

```env
MONGO_URI=mongodb://127.0.0.1:27017/jobdb
JWT_SECRET=replace-with-a-long-random-string
PORT=5000
```

For Atlas, use your cluster connection string as `MONGO_URI`.

The React app talks to the API at `http://localhost:5000/api` (see `client/src/api.js`). Change that base URL if the server runs elsewhere.

## Run locally

Start the API, then the frontend, in two terminals.

**Terminal 1 — server**

```bash
cd server
node index.js
```

The API listens on [http://localhost:5000](http://localhost:5000). You should see MongoDB connected in the console.

**Terminal 2 — client**

```bash
cd client
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000).

Sign in at `/` or create an account at `/register` and choose **candidate** or **recruiter**.

## App routes

| Path | Who | Description |
| --- | --- | --- |
| `/` | Public | Login (redirects if already signed in) |
| `/register` | Public | Register as candidate or recruiter |
| `/dashboard` | Signed in | Role-specific overview |
| `/profile` | Signed in | View and update profile / resume |
| `/jobs` | Candidate | Find jobs |
| `/jobs/:id` | Signed in | Job details and apply |
| `/post-job` | Recruiter | Create a listing |
| `/jobs-posted` | Recruiter | Manage listings |
| `/edit-job/:id` | Recruiter | Update a listing |
| `/applicants/:jobId` | Recruiter | Applicants for a job |

## API overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Notes |
| --- | --- | --- |
| `POST` | `/auth/register` | `{ name, email, password, role }` |
| `POST` | `/auth/login` | Returns `{ token, user }` |
| `GET` | `/auth/validate` | Requires JWT |
| `GET` | `/jobs` | Optional `?skills=` filter |
| `GET` | `/jobs/:id` | Job by id |
| `POST` | `/jobs` | Recruiter + JWT |
| `PUT` | `/jobs/:id` | Recruiter + JWT |
| `DELETE` | `/jobs/:id` | Recruiter + JWT |
| `POST` | `/profile` | Multipart: `data` (JSON) + optional `resume` file |
| `GET` | `/profile/:email` | Profile by email |
| `POST` | `/applications/apply` | `{ email, jobId }` |
| `GET` | `/applications/applicants/:jobId` | Applicants for a job |
| `DELETE` | `/applications/withdraw` | `{ jobId, email }` |

Uploaded resumes are served from `http://localhost:5000/uploads/resumes/...`.

## Typical workflow

1. Register two accounts: one **candidate** and one **recruiter**.
2. As a recruiter, complete the company profile, post a job, then open **Jobs Posted**.
3. As a candidate, add skills, a target role, and a resume, then apply from job details.
4. As a recruiter, open **Applicants** on that job to review resumes and links.

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| `client` | `npm start` | Development server (port 3000) |
| `client` | `npm run build` | Production build |
| `client` | `npm test` | React test runner |
| `server` | `node index.js` | Start the API (port 5000) |

## Notes

- Keep `JWT_SECRET` private and use a strong value in production.
- Never commit `server/.env` or MongoDB credentials.
- The client stores `token`, `userRole`, `userId`, and `userEmail` in `localStorage`.
- Job recommendations match the candidate’s profile **role** against job titles (case-insensitive).
