# Unified Campus Management System — TIET

A single web platform for Thapar students covering Lost & Found, Professor Cabin Info,
Academic Calendar, Subgroup Schedules, Societies, and Campus Map.

---

## Tech Stack

| Layer    | Technology                                  |
|----------|---------------------------------------------|
| Frontend | React + Vite, Fetch API, plain CSS          |
| Backend  | Python, FastAPI, SQLModel, Alembic, Uvicorn |
| Database | PostgreSQL 16                               |
| Auth     | Not yet implemented                         |
| DevOps   | Docker, Docker Compose                      |
| VCS      | Git + GitHub                                |

---

## Implemented Features

### Professor Directory (`/professors`)

- Browse all professors in a searchable, filterable card grid
- Live search by name, department, or subjects taught
- Filter by department (list is loaded dynamically from the database)
- Click into a professor's profile page for full details: designation, department,
  official email, phone, cabin/office, subjects, and any linked Google Scholar,
  personal website, LinkedIn, or other profile links
- Backed by `GET /professors`, `GET /professors/departments`, `GET /professors/{id}`

### Lost & Found (`/lost-found`)

- Submit a "Lost Item" or "Found Item" report with reporter name, roll number,
  contact number, item name, location, date, description, and an optional photo
- Uploaded photos are validated by content type and size, stored server-side, and
  served back to the app
- Browse a searchable, filterable board of all reports (search across item name,
  description, and location; filter by Lost/Found)
- Click into a report's detail page to see the reporter's name and contact number
  (roll number is never exposed publicly) and call/message them directly
- The API supports marking a report as `RESOLVED`, but this is not yet wired into
  the UI — resolving a report should be restricted to the original reporter, which
  needs reporter accounts (not yet implemented)

**Not yet implemented:** authentication/reporter accounts, admin management,
production deployment configuration, and the other pages in navigation (Societies,
Campus Map, Academic Calendar, Campus Info), which are currently UI shells only.

---

## Future Direction / Production Deployment

Everything in this section is intended future work — none of it is implemented yet.
The current environment (Docker Compose running PostgreSQL, the FastAPI backend, and
the React/Vite frontend together, see [Tech Stack](#tech-stack)) is local development
only.

- **Image storage:** Lost & Found photo uploads are currently written to the
  `uploads_data` Docker volume for local development (see `docker-compose.yml`). In
  production, uploaded images should move from this local Docker volume to persistent
  cloud/object storage. The specific provider has **not** been decided — this is an
  open decision, not a name to fill in later.
- **Application data:** PostgreSQL will continue to be the store for report and
  application data (Lost & Found reports, professor records, etc.) regardless of where
  image binaries end up — only the images themselves would move to object storage.
- **Public deployment:** the app is intended to eventually be made publicly
  accessible, with the frontend potentially deployed on a platform like Vercel. Backend
  and database hosting have not been decided.
- **Auth:** authentication/authorization is required before production, particularly
  to gate administrative actions such as resolving a Lost & Found report (the API
  already supports `PATCH /lost-found/reports/{id}/status`, but nothing restricts who
  can call it yet — see [Lost & Found](#lost--found-lost-found) above).
- **Also future work, not currently implemented:** production deployment
  configuration, cloud storage integration, security hardening, production CORS
  configuration (the current `CORS_ORIGINS` is a localhost dev default), and
  upload limits/rate limiting beyond the current per-file `MAX_UPLOAD_SIZE_MB`
  dev default.

---

## Prerequisites

Install these before anything else:

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

That's it. Docker handles Python, Node, and PostgreSQL — you don't need to install them separately.

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Simarbir2112006/unified-campus-tiet.git
cd unified-campus-tiet
```

### 2. Create your environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`.env.example` ships with empty values, so fill in the local development values
below (these are plain Docker Compose defaults, not secrets):

**backend/.env**
```
ENVIRONMENT=development
DATABASE_URL=postgresql://postgres:postgres@db:5432/campus_db
CORS_ORIGINS=http://localhost:5173
UPLOAD_DIR=/data/uploads
MAX_UPLOAD_SIZE_MB=5
```

**frontend/.env**
```
VITE_API_URL=http://localhost:8000
```

### 3. Start everything

```bash
docker compose up --build
```

First time will take a few minutes as Docker pulls images and installs dependencies.
After that it will be much faster.

### 4. Run database migrations

```bash
docker compose exec backend alembic upgrade head
```

This creates the database tables for the features implemented so far (Professor
Directory, Lost & Found). Run it once after the containers are up, and again any
time new migrations are added.

### 5. Verify it is working

| Service     | URL                        |
|-------------|----------------------------|
| Frontend    | http://localhost:5173       |
| Backend API | http://localhost:8000       |
| API Docs    | http://localhost:8000/docs  |

### 6. Stopping

```bash
docker compose down      # stops containers, keeps database data
docker compose down -v   # stops containers and wipes database (fresh start)
```

---

## Branch Structure

```
teammate-1 ──┐
teammate-2 ──┤──→  dev  ──→  main
teammate-3 ──┘
```

| Branch       | Purpose                                               |
|--------------|-------------------------------------------------------|
| `main`       | Stable version only. Updated before demos/submissions |
| `dev`        | Active development. All PRs merge here                |
| `teammate-1` | Personal working branch for teammate 1                |
| `teammate-2` | Personal working branch for teammate 2                |
| `teammate-3` | Personal working branch for teammate 3                |

**Rules:**
- Never push directly to `dev` or `main`
- Always work on your personal branch
- Open a PR into `dev` when your work is ready
- Only the project admin reviews and merges PRs

---

## Setting Up Your Branch (Do This Once After Cloning)

```bash
git checkout dev                # switch to dev first
git pull origin dev             # make sure you have the latest
git checkout -b teammate-x      # replace x with your number e.g. teammate-1
git push origin teammate-x      # push it to GitHub
```

---

## Day to Day Workflow

### 1. Before starting work, sync with dev

```bash
git checkout dev
git pull origin dev
git checkout teammate-x
git merge dev
```

Do this every time before you start working so you have your teammates latest merged work.

### 2. Do your work, then commit

```bash
git add .
git commit -m "feat(lost-and-found): add post creation endpoint"
git push origin teammate-x
```

### 3. Open a Pull Request

1. Go to https://github.com/Simarbir2112006/unified-campus-tiet
2. You will see a banner — **"teammate-x had recent pushes"** → click **Compare & pull request**
3. Make sure it says `base: dev` ← `compare: teammate-x` (double check this every time)
4. Add a clear title and a short description of what you did
5. Click **Create pull request**
6. The project admin will review and merge it into `dev`

---

## Commit Message Format

We follow the Conventional Commits standard.

```
type(scope): short description
```

| Type       | When to use                            |
|------------|----------------------------------------|
| `feat`     | Adding something new                   |
| `fix`      | Fixing a bug                           |
| `chore`    | Setup, config, dependencies            |
| `docs`     | README or comments only                |
| `refactor` | Restructuring code, no behavior change |
| `style`    | Formatting only, no logic change       |

**Examples:**
```
chore: add docker compose config
feat(auth): add JWT login endpoint
fix(schedules): correct subgroup filter query
docs: update README with branch setup steps
refactor(professors): move search logic to service layer
```

**Rules:**
- Always lowercase
- No period at the end
- Keep it under 72 characters
- Be specific — `fix: bug` is bad, `fix(auth): token not expiring correctly` is good

---

## External Contributors

If you are not part of the core team but want to contribute:

1. **Fork** the repo on GitHub using the Fork button on the top right
2. Clone your fork locally

```bash
git clone https://github.com/your-username/unified-campus-tiet.git
cd unified-campus-tiet
```

3. Create a branch for your work

```bash
git checkout -b feature/what-you-are-adding
```

4. Make your changes, commit using the commit format above, and push to your fork
5. Open a Pull Request from your fork into the `dev` branch of the original repo
6. The project admin will review it

---

## Project Structure

```
unified-campus-tiet/
├── backend/
│   ├── app/
│   │   ├── core/        # config, file upload handling
│   │   ├── models/      # database models
│   │   ├── schemas/     # request and response schemas
│   │   ├── routers/     # API route handlers
│   │   └── db/          # database engine and session
│   ├── migrations/      # Alembic migrations
│   ├── tests/           # pytest test suite
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/  # reusable UI components
│   │   ├── pages/       # one folder per feature
│   │   └── api/         # fetch calls to backend
│   └── .env.example
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Common Issues

**Docker port already in use**

```bash
# Mac/Linux
lsof -i :8000

# Windows
netstat -ano | findstr :8000
```

Kill the process using that port or change the port number in `docker-compose.yml`.

**Backend cannot connect to database**

```bash
docker compose up db
# wait for it to be ready, then in a new terminal
docker compose up backend
```

**Changes not reflecting**

The backend has hot reload and the frontend Vite dev server auto refreshes.
If something seems stuck run:

```bash
docker compose down
docker compose up --build
```
