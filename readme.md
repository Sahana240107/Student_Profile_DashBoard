# 🎓 Student Profile System

React + Express + MySQL — full-stack student profile management.

---

## 📁 Structure

```
student-profile/
├── backend/
│   ├── server.js      ← Express API  (port 3001)
│   ├── schema.sql     ← Full MySQL schema + sample data
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── package.json
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js         ← Router + sidebar layout
        ├── api.js         ← Axios helpers
        └── pages/
            ├── Home.js         ← Search
            ├── Profile.js      ← Overview
            ├── Personal.js     ← Personal + Hostel
            ├── Parents.js      ← Parent details
            ├── Academic.js     ← Marks, grades, GPA
            ├── Arrears.js      ← Arrear tracking
            ├── Achievements.js ← Year-wise achievements
            └── Projects.js     ← Projects + Placements
```

---

## 🚀 Quick Start

### 1 — Database

```bash
mysql -u root -p < backend/schema.sql
```

This creates the `student_db` database, all 11 tables, and inserts sample
data for two students (reg nos **2021001** and **2021002**).

### 2 — Set DB password

Open `backend/server.js` line ~11:

```js
password: '',   // ← put your MySQL root password here
```

### 3 — Start backend

```bash
cd backend
npm install
npm run dev          # or: npm start
# → http://localhost:3001
```

### 4 — Start frontend

```bash
cd frontend
npm install
npm start
# → http://localhost:3000
```

---

## 🗄️ Tables Used

| Table | Source |
|-------|--------|
| `STUDENT` | Core info (personal fields included) |
| `HOSTEL_DETAIL` | Block & room per year |
| `PARENT_DETAIL` | Father / Mother / Guardian |
| `SUBJECT` | Subject master |
| `ACADEMIC_DETAIL` | Marks, grades, result per subject |
| `SEMESTER_GPA` | GPA per semester (your extra table) |
| `ARREAR_DETAIL` | Arrear & RE-DO records |
| `ACHIEVEMENT` | Year-wise achievements |
| `PROJECT` | Final-year project info |
| `PLACEMENT_INTERNSHIP` | Placement & internship records |

> **ATTENDANCE table excluded** as requested.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students/search?q=` | Search by name / reg no |
| GET | `/api/students/:reg` | Full student row |
| GET | `/api/students/:reg/personal` | Personal + hostel |
| GET | `/api/students/:reg/parents` | All parent rows |
| GET | `/api/students/:reg/academic` | Subjects (joined) + GPAs |
| GET | `/api/students/:reg/arrears` | Arrears (joined with SUBJECT) |
| GET | `/api/students/:reg/achievements` | Achievements |
| GET | `/api/students/:reg/projects` | Projects + placements |