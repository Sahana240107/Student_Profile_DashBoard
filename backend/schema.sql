-- ============================================================
--  Student Profile Automation System — Full Schema
--  Run: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

-- ── 1. STUDENT ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS STUDENT (
    register_no           INT             PRIMARY KEY,
    name                  VARCHAR(100)    NOT NULL,
    dob                   DATE            NOT NULL,
    gender                ENUM('Male','Female','Other') NOT NULL,
    phone_no              BIGINT,
    email                 VARCHAR(100)    UNIQUE,
    degree                VARCHAR(50)     NOT NULL,
    department            VARCHAR(100)    NOT NULL,
    year_of_study         INT             CHECK (year_of_study BETWEEN 1 AND 4),
    current_semester      INT             CHECK (current_semester BETWEEN 1 AND 8),
    status                ENUM('Active','Inactive','Passed Out') DEFAULT 'Active',
    admitted_on           DATE,
    community             VARCHAR(50),
    blood_group           VARCHAR(5),
    cutoff_mark           DECIMAL(5,2),
    special_category      VARCHAR(100),
    scholarship           VARCHAR(100),
    hobbies               TEXT,
    volunteer_activity    VARCHAR(100),
    day_scholar_hosteller ENUM('Day Scholar','Hosteller'),
    profile_photo         VARCHAR(255)
);

-- ── 2. HOSTEL_DETAIL ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS HOSTEL_DETAIL (
    hostel_id   INT  PRIMARY KEY AUTO_INCREMENT,
    register_no INT  NOT NULL,
    year        INT  NOT NULL CHECK (year BETWEEN 1 AND 4),
    block       VARCHAR(50),
    room_no     VARCHAR(20),
    FOREIGN KEY (register_no) REFERENCES STUDENT(register_no) ON DELETE CASCADE
);

-- ── 3. PARENT_DETAIL ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS PARENT_DETAIL (
    parent_id     INT  PRIMARY KEY AUTO_INCREMENT,
    register_no   INT  NOT NULL,
    relation      ENUM('Father','Mother','Guardian') NOT NULL,
    name          VARCHAR(100)  NOT NULL,
    occupation    VARCHAR(100),
    annual_income DECIMAL(12,2),
    phone_no      BIGINT,
    email         VARCHAR(100),
    address       TEXT,
    FOREIGN KEY (register_no) REFERENCES STUDENT(register_no) ON DELETE CASCADE
);

-- ── 4. SUBJECT ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS SUBJECT (
    subject_id   INT  PRIMARY KEY AUTO_INCREMENT,
    course_code  VARCHAR(20)  UNIQUE NOT NULL,
    subject_name VARCHAR(150) NOT NULL,
    credit       INT          NOT NULL,
    semester     INT          NOT NULL CHECK (semester BETWEEN 1 AND 8),
    department   VARCHAR(100),
    subject_type ENUM('Theory','Lab','Project','Elective')
);

-- ── 5. ACADEMIC_DETAIL ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS ACADEMIC_DETAIL (
    academic_id   INT  PRIMARY KEY AUTO_INCREMENT,
    register_no   INT  NOT NULL,
    subject_id    INT  NOT NULL,
    semester      INT  NOT NULL,
    internal_mark DECIMAL(5,2),
    grade         VARCHAR(5),
    result        ENUM('Pass','Fail','Withheld'),
    exam_year     YEAR,
    attempt_no    INT  DEFAULT 1,
    FOREIGN KEY (register_no) REFERENCES STUDENT(register_no) ON DELETE CASCADE,
    FOREIGN KEY (subject_id)  REFERENCES SUBJECT(subject_id),
    INDEX idx_academic_student_sem (register_no, semester)
);

-- ── 6. SEMESTER_GPA  (added table) ───────────────────────────
CREATE TABLE IF NOT EXISTS SEMESTER_GPA (
    gpa_id      INT            PRIMARY KEY AUTO_INCREMENT,
    register_no INT            NOT NULL,
    semester    INT            NOT NULL,
    gpa         DECIMAL(4,2)  NOT NULL,
    FOREIGN KEY (register_no) REFERENCES STUDENT(register_no) ON DELETE CASCADE
);

-- ── 7. ARREAR_DETAIL ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ARREAR_DETAIL (
    arrear_id        INT  PRIMARY KEY AUTO_INCREMENT,
    register_no      INT  NOT NULL,
    subject_id       INT  NOT NULL,
    semester_failed  INT  NOT NULL,
    internal_marks   DECIMAL(5,2),
    advisor_name     VARCHAR(100),
    cleared_semester INT,
    cleared_grade    VARCHAR(5),
    status           ENUM('Pending','Cleared','Re-Do') DEFAULT 'Pending',
    FOREIGN KEY (register_no) REFERENCES STUDENT(register_no) ON DELETE CASCADE,
    FOREIGN KEY (subject_id)  REFERENCES SUBJECT(subject_id),
    INDEX idx_arrear_student_status (register_no, status)
);

-- ── 8. ACHIEVEMENT ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ACHIEVEMENT (
    achievement_id INT  PRIMARY KEY AUTO_INCREMENT,
    register_no    INT  NOT NULL,
    year           INT  NOT NULL CHECK (year BETWEEN 1 AND 4),
    title          VARCHAR(255) NOT NULL,
    FOREIGN KEY (register_no) REFERENCES STUDENT(register_no) ON DELETE CASCADE
);

-- ── 9. PROJECT ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS PROJECT (
    project_id    INT  PRIMARY KEY AUTO_INCREMENT,
    register_no   INT  NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    guide_name    VARCHAR(100),
    semester      INT,
    year          INT,
    FOREIGN KEY (register_no) REFERENCES STUDENT(register_no) ON DELETE CASCADE
);

-- ── 10. PLACEMENT_INTERNSHIP ─────────────────────────────────
CREATE TABLE IF NOT EXISTS PLACEMENT_INTERNSHIP (
    placement_id INT  PRIMARY KEY AUTO_INCREMENT,
    register_no  INT  NOT NULL,
    type         ENUM('Placement','Internship') NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    package_lpa  DECIMAL(6,2),
    FOREIGN KEY (register_no) REFERENCES STUDENT(register_no) ON DELETE CASCADE
);

-- ════════════════════════════════════════════════════════════
--  SAMPLE DATA  (2 students for testing)
-- ════════════════════════════════════════════════════════════
INSERT IGNORE INTO STUDENT VALUES
(2021001,'Arun Kumar','2003-05-12','Male',9876543210,'arun@college.edu',
 'B.E','Computer Science',3,5,'Active','2021-11-01','OBC','O+',
 185.50,'None','Merit Scholarship','Cricket, Coding','NSS','Hosteller',NULL),
(2021002,'Priya Sharma','2003-08-24','Female',9876500001,'priya@college.edu',
 'B.E','Electronics',3,5,'Active','2021-11-01','BC','A+',
 190.00,'None','Government Scholarship','Reading, Dance','YRC','Day Scholar',NULL);

INSERT IGNORE INTO HOSTEL_DETAIL (register_no,year,block,room_no) VALUES
(2021001,1,'A','A-101'),(2021001,2,'A','A-205'),(2021001,3,'B','B-310');

INSERT IGNORE INTO PARENT_DETAIL (register_no,relation,name,occupation,annual_income,phone_no,email,address) VALUES
(2021001,'Father','Ramesh Kumar','Software Engineer',600000,9800000001,'ramesh@gmail.com','12 Anna Nagar, Chennai - 600040'),
(2021001,'Mother','Meena Kumar','School Teacher',360000,9800000002,'meena@gmail.com','12 Anna Nagar, Chennai - 600040'),
(2021002,'Father','Sharma Raj','Business',850000,9800000003,'raj@gmail.com','5 T Nagar, Chennai - 600017'),
(2021002,'Mother','Raji Sharma','Homemaker',0,9800000004,NULL,'5 T Nagar, Chennai - 600017');

INSERT IGNORE INTO SUBJECT (course_code,subject_name,credit,semester,department,subject_type) VALUES
('CS101','Engineering Mathematics I',4,1,'Computer Science','Theory'),
('CS102','Problem Solving & Python Programming',4,1,'Computer Science','Theory'),
('CS103','Python Lab',2,1,'Computer Science','Lab'),
('CS201','Data Structures',4,2,'Computer Science','Theory'),
('CS202','Digital Electronics',3,2,'Computer Science','Theory'),
('CS203','Data Structures Lab',2,2,'Computer Science','Lab'),
('CS301','Operating Systems',4,3,'Computer Science','Theory'),
('CS302','Computer Networks',4,3,'Computer Science','Theory'),
('CS303','OS Lab',2,3,'Computer Science','Lab'),
('EC101','Circuit Theory',4,1,'Electronics','Theory'),
('EC102','Engineering Mathematics I',4,1,'Electronics','Theory'),
('EC201','Signals & Systems',4,2,'Electronics','Theory'),
('EC202','Electronic Devices',3,2,'Electronics','Theory');

INSERT IGNORE INTO ACADEMIC_DETAIL (register_no,subject_id,semester,internal_mark,grade,result,exam_year,attempt_no) VALUES
(2021001,1,1,72,'B+','Pass',2022,1),
(2021001,2,1,85,'A','Pass',2022,1),
(2021001,3,1,88,'A','Pass',2022,1),
(2021001,4,2,78,'A','Pass',2022,1),
(2021001,5,2,60,'C','Fail',2022,1),
(2021001,6,2,74,'B+','Pass',2022,1),
(2021001,7,3,80,'A','Pass',2023,1),
(2021001,8,3,70,'B+','Pass',2023,1),
(2021001,9,3,90,'A+','Pass',2023,1),
(2021002,10,1,88,'A+','Pass',2022,1),
(2021002,11,1,75,'A','Pass',2022,1),
(2021002,12,2,82,'A','Pass',2022,1),
(2021002,13,2,68,'B','Pass',2022,1);

INSERT IGNORE INTO SEMESTER_GPA (register_no,semester,gpa) VALUES
(2021001,1,8.20),(2021001,2,7.60),(2021001,3,8.50),
(2021002,1,8.90),(2021002,2,8.40);

INSERT IGNORE INTO ARREAR_DETAIL (register_no,subject_id,semester_failed,internal_marks,advisor_name,cleared_semester,cleared_grade,status) VALUES
(2021001,5,2,60,'Dr. Rajan',3,'B','Cleared');

INSERT IGNORE INTO ACHIEVEMENT (register_no,year,title) VALUES
(2021001,1,'1st Place — Coding Contest, Techfest 2022'),
(2021001,2,'Paper published: ML-based Student Performance Predictor, ICSC 2023'),
(2021001,3,'Smart India Hackathon 2023 — Finalist'),
(2021002,1,'Best Outgoing Student Award — Dept. of Electronics'),
(2021002,2,'2nd Place — Circuit Design Competition, Electra 2023');

INSERT IGNORE INTO PROJECT (register_no,project_title,guide_name,semester,year) VALUES
(2021001,'AI-based Student Performance Predictor','Dr. P. Ravi',7,4),
(2021002,'Smart Attendance System using Face Recognition','Dr. S. Kumar',7,4);

INSERT IGNORE INTO PLACEMENT_INTERNSHIP (register_no,type,company_name,package_lpa) VALUES
(2021001,'Internship','TCS iON Summer Internship',NULL),
(2021001,'Placement','Infosys',4.50),
(2021002,'Internship','Zoho Corp Internship',NULL);