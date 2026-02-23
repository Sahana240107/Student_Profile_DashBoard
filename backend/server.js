const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────
//  DB CONFIG  ← only change password if needed
// ─────────────────────────────────────────────────
const pool = mysql.createPool({
  host:            'localhost',
  port:            3306,
  user:            'root',
  password:        'root',          // ← your MySQL root password
  database:        'student_profile',
  waitForConnections: true,
  connectionLimit: 10,
});

async function q(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// ══════════════════════════════════════════════════
//  SEARCH
// ══════════════════════════════════════════════════
app.get('/api/students/search', async (req, res) => {
  try {
    const like = `%${req.query.q || ''}%`;
    const rows = await q(
      `SELECT register_no, name, degree, department
       FROM STUDENT
       WHERE CAST(register_no AS CHAR) LIKE ? OR name LIKE ?
       LIMIT 15`,
      [like, like]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  STUDENT PROFILE  (core STUDENT table)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg', async (req, res) => {
  try {
    const [student] = await q(
      `SELECT register_no, name, dob, gender, phone_no, email,
              degree, department, year_of_study, current_semester,
              status, admitted_on, community, blood_group,
              cutoff_mark, special_category, scholarship,
              hobbies, volunteer_activity, day_scholar_hosteller,
              profile_photo
       FROM STUDENT WHERE register_no = ?`,
      [req.params.reg]
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  PERSONAL DETAILS  (STUDENT + HOSTEL_DETAIL)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/personal', async (req, res) => {
  try {
    const reg = req.params.reg;

    const [student] = await q(
      `SELECT register_no, admitted_on, community, blood_group,
              cutoff_mark, special_category, scholarship,
              hobbies, volunteer_activity, day_scholar_hosteller
       FROM STUDENT WHERE register_no = ?`,
      [reg]
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const hostel = await q(
      `SELECT year, block, room_no
       FROM HOSTEL_DETAIL WHERE register_no = ? ORDER BY year`,
      [reg]
    );

    res.json({ ...student, hostel });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  PARENT DETAILS  (PARENT_DETAIL)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/parents', async (req, res) => {
  try {
    const rows = await q(
      `SELECT parent_id, relation, name, occupation,
              annual_income, phone_no, email, address
       FROM PARENT_DETAIL WHERE register_no = ?`,
      [req.params.reg]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  ACADEMIC DETAILS  (ACADEMIC_DETAIL ⋈ SUBJECT + SEMESTER_GPA)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/academic', async (req, res) => {
  try {
    const reg = req.params.reg;

    const subjects = await q(
      `SELECT ad.academic_id, ad.semester, ad.internal_mark,
              ad.grade, ad.result, ad.exam_year, ad.attempt_no,
              s.course_code, s.subject_name, s.credit, s.subject_type
       FROM ACADEMIC_DETAIL ad
       JOIN SUBJECT s ON s.subject_id = ad.subject_id
       WHERE ad.register_no = ?
       ORDER BY ad.semester, s.course_code`,
      [reg]
    );

    const gpas = await q(
      `SELECT semester, gpa FROM SEMESTER_GPA
       WHERE register_no = ? ORDER BY semester`,
      [reg]
    );

    res.json({ subjects, gpas });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  ARREAR DETAILS  (ARREAR_DETAIL ⋈ SUBJECT)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/arrears', async (req, res) => {
  try {
    const rows = await q(
      `SELECT ar.arrear_id, ar.semester_failed, ar.internal_marks,
              ar.advisor_name, ar.cleared_semester, ar.cleared_grade,
              ar.status,
              s.course_code, s.subject_name
       FROM ARREAR_DETAIL ar
       JOIN SUBJECT s ON s.subject_id = ar.subject_id
       WHERE ar.register_no = ?
       ORDER BY ar.semester_failed`,
      [req.params.reg]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  ACHIEVEMENTS  (ACHIEVEMENT)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/achievements', async (req, res) => {
  try {
    const rows = await q(
      `SELECT achievement_id, year, title
       FROM ACHIEVEMENT WHERE register_no = ? ORDER BY year`,
      [req.params.reg]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  PROJECTS & PLACEMENTS  (PROJECT + PLACEMENT_INTERNSHIP)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/projects', async (req, res) => {
  try {
    const reg = req.params.reg;

    const projects = await q(
      `SELECT project_id, project_title, guide_name, semester, year
       FROM PROJECT WHERE register_no = ?`,
      [reg]
    );

    const placements = await q(
      `SELECT placement_id, type, company_name, package_lpa
       FROM PLACEMENT_INTERNSHIP WHERE register_no = ?
       ORDER BY type`,
      [reg]
    );

    res.json({ projects, placements });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅  Backend running →  http://localhost:${PORT}`);
});