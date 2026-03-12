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
  password:        'Keerthi@nb55',          // ← your MySQL root password
  database:        'ct-automation',
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
      `SELECT s.register_no, s.name,
              deg.name AS degree,
              dep.name AS department
       FROM student s
       LEFT JOIN degree     deg ON deg.degree_id     = s.degree_id
       LEFT JOIN department dep ON dep.department_id = s.department_id
       WHERE CAST(s.register_no AS CHAR) LIKE ? OR s.name LIKE ?
       LIMIT 15`,
      [like, like]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  STUDENT PROFILE  (student + lookups)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg', async (req, res) => {
  try {
    const [student] = await q(
      `SELECT s.register_no, s.name, s.dob, s.gender, s.phone_no, s.email,
              deg.name  AS degree,
              dep.name  AS department,
              sa.year_of_study, sa.current_semester,
              s.status, s.admitted_on, s.profile_photo,
              c.name    AS community,
              bg.name   AS blood_group,
              sa.cutoff_mark, sa.special_category,
              sp.day_scholar_hosteller,
              sp.hobbies, sp.volunteer_activity
       FROM student s
       LEFT JOIN degree            deg ON deg.degree_id        = s.degree_id
       LEFT JOIN department        dep ON dep.department_id    = s.department_id
       LEFT JOIN student_admission sa  ON sa.register_no       = s.register_no
       LEFT JOIN student_personal  sp  ON sp.register_no       = s.register_no
       LEFT JOIN blood_group       bg  ON bg.blood_group_id    = sp.blood_group_id
       LEFT JOIN community         c   ON c.community_id       = sp.community_id
       WHERE s.register_no = ?`,
      [req.params.reg]
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  PERSONAL DETAILS  (student + student_personal + student_admission +
//                     student_scholarship + hostel_detail)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/personal', async (req, res) => {
  try {
    const reg = req.params.reg;

    const [base] = await q(
      `SELECT s.register_no, s.admitted_on,
              c.name   AS community,
              bg.name  AS blood_group,
              sa.cutoff_mark, sa.special_category,
              sp.day_scholar_hosteller, sp.hobbies, sp.volunteer_activity
       FROM student s
       LEFT JOIN student_admission sa  ON sa.register_no    = s.register_no
       LEFT JOIN student_personal  sp  ON sp.register_no    = s.register_no
       LEFT JOIN blood_group       bg  ON bg.blood_group_id = sp.blood_group_id
       LEFT JOIN community         c   ON c.community_id    = sp.community_id
       WHERE s.register_no = ?`,
      [reg]
    );
    if (!base) return res.status(404).json({ error: 'Student not found' });

    // Scholarship — return first active entry name, or null
    const scholarships = await q(
      `SELECT name FROM student_scholarship
       WHERE register_no = ? AND status = 'Active'
       ORDER BY awarded_year DESC LIMIT 1`,
      [reg]
    );
    const scholarship = scholarships.length ? scholarships[0].name : null;

    // Hostel details — join through hostel_room → hostel_block
    const hostel = await q(
      `SELECT hd.year, hb.block_name AS block, hr.room_no
       FROM hostel_detail hd
       JOIN hostel_room  hr ON hr.room_id  = hd.room_id
       JOIN hostel_block hb ON hb.block_id = hr.block_id
       WHERE hd.register_no = ?
       ORDER BY hd.year`,
      [reg]
    );

    res.json({ ...base, scholarship, hostel });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  PARENT DETAILS  (parent_detail)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/parents', async (req, res) => {
  try {
    const rows = await q(
      `SELECT parent_id, relation, name, occupation,
              annual_income, phone_no, email, address
       FROM parent_detail WHERE register_no = ?`,
      [req.params.reg]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  ACADEMIC DETAILS  (academic_record ⋈ subject + subject_type +
//                     grade_master + semester_gpa)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/academic', async (req, res) => {
  try {
    const reg = req.params.reg;

    const subjects = await q(
      `SELECT ar.academic_id, ar.semester, ar.internal_mark,
              gm.grade, ar.result, ar.exam_year, ar.attempt_no,
              s.course_code, s.subject_name, s.credit,
              st.label AS subject_type
       FROM academic_record ar
       JOIN subject      s  ON s.subject_id  = ar.subject_id
       LEFT JOIN grade_master  gm ON gm.grade_id   = ar.grade_id
       LEFT JOIN subject_type  st ON st.type_id     = s.type_id
       WHERE ar.register_no = ?
       ORDER BY ar.semester, s.course_code`,
      [reg]
    );

    const gpas = await q(
      `SELECT semester, gpa FROM semester_gpa
       WHERE register_no = ? ORDER BY semester`,
      [reg]
    );

    res.json({ subjects, gpas });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  ARREAR DETAILS  (arrear_detail ⋈ subject + staff + grade_master)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/arrears', async (req, res) => {
  try {
    const rows = await q(
      `SELECT ar.arrear_id, ar.semester_failed, ar.internal_marks,
              st.name  AS advisor_name,
              ar.cleared_semester,
              gm.grade AS cleared_grade,
              ar.status,
              s.course_code, s.subject_name
       FROM arrear_detail ar
       JOIN subject      s  ON s.subject_id       = ar.subject_id
       LEFT JOIN staff        st ON st.staff_id        = ar.advisor_id
       LEFT JOIN grade_master gm ON gm.grade_id        = ar.cleared_grade_id
       WHERE ar.register_no = ?
       ORDER BY ar.semester_failed`,
      [req.params.reg]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  ACHIEVEMENTS  (achievement)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/achievements', async (req, res) => {
  try {
    const rows = await q(
      `SELECT achievement_id, year, title
       FROM achievement WHERE register_no = ? ORDER BY year`,
      [req.params.reg]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════
//  PROJECTS & PLACEMENTS  (project_member ⋈ project + staff +
//                           placement_internship ⋈ company)
// ══════════════════════════════════════════════════
app.get('/api/students/:reg/projects', async (req, res) => {
  try {
    const reg = req.params.reg;

    const projects = await q(
      `SELECT p.project_id, p.project_title,
              st.name AS guide_name,
              p.semester, p.year
       FROM project_member pm
       JOIN project p  ON p.project_id  = pm.project_id
       LEFT JOIN staff st ON st.staff_id  = p.guide_id
       WHERE pm.register_no = ?`,
      [reg]
    );

    const placements = await q(
      `SELECT pi.placement_id, pi.type,
              c.name AS company_name,
              pi.package_lpa
       FROM placement_internship pi
       JOIN company c ON c.company_id = pi.company_id
       WHERE pi.register_no = ?
       ORDER BY pi.type`,
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