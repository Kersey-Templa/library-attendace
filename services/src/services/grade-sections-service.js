const db = require("../config/database.js");
const {
  CREATE_GRADE_SECTION,
  FIND_ALL_GRADE_SECTIONS,
  FIND_GRADE_SECTION_BY_ID,
  FIND_GRADE_SECTIONS_BY_SCHOOL_YEAR,
  FIND_GRADE_SECTIONS_BY_GRADE_N_STRAND,
  FIND_GRADE_SECTIONS_BY_ADVISER,
  FIND_GRADE_SECTION,
  UPDATE_GRADE_SECTION,
  DELETE_GRADE_SECTION,
} = require("../database/queries/grade_sections-query.js");

// CREATE
const createGradeSection = async (school_year_id, grade_n_strand_id, adviser_staff_id, section_name, description) => {
  if (!school_year_id || !grade_n_strand_id || !section_name) {
    throw new Error("School year ID, grade N strand ID, and section name are required.");
  }

  const [result] = await db.query(CREATE_GRADE_SECTION, [
    school_year_id,
    grade_n_strand_id,
    adviser_staff_id,
    section_name,
    description,
  ]);

  return result;
};

// READ - Get all grade sections
const findAllGradeSections = async () => {
  const [rows] = await db.query(FIND_ALL_GRADE_SECTIONS);

  return rows;
};

// READ - Get grade section by ID
const findGradeSectionById = async (id) => {
  if (!id) {
    throw new Error("Grade section ID is required.");
  }

  const [rows] = await db.query(FIND_GRADE_SECTION_BY_ID, [id]);

  return rows[0] || null;
};

// READ - Get grade sections by school year
const findGradeSectionsBySchoolYear = async (school_year_id) => {
  if (!school_year_id) {
    throw new Error("School year ID is required.");
  }

  const [rows] = await db.query(FIND_GRADE_SECTIONS_BY_SCHOOL_YEAR, [school_year_id]);

  return rows;
};

// READ - Get grade sections by grade and strand
const findGradeSectionsByGradeNStrand = async (id) => {
  if (!id) {
    throw new Error("Grade N strand ID is required.");
  }

  const [rows] = await db.query(FIND_GRADE_SECTIONS_BY_GRADE_N_STRAND, [id]);

  return rows;
};

// READ - Get grade sections by adviser
const findGradeSectionsByAdviser = async (adviser_staff_id) => {
  if (!adviser_staff_id) {
    throw new Error("Adviser staff ID is required.");
  }

  const [rows] = await db.query(FIND_GRADE_SECTIONS_BY_ADVISER, [adviser_staff_id]);

  return rows;
};

// READ - Check specific grade section
const findGradeSection = async (school_year_id, grade_n_strand_id, section_name) => {
  if (!school_year_id || !grade_n_strand_id || !section_name) {
    throw new Error("School year ID, grade N strand ID, and section name are required.");
  }

  const [rows] = await db.query(FIND_GRADE_SECTION, [school_year_id, grade_n_strand_id, section_name]);

  return rows[0] || null;
};

// UPDATE
const updateGradeSection = async (
  id,
  school_year_id,
  grade_n_strand_id,
  adviser_staff_id,
  section_name,
  description,
) => {
  if (!id || !school_year_id || !grade_n_strand_id || !section_name) {
    throw new Error("Grade section ID, school year ID, grade N strand ID, and section name are required.");
  }

  const [result] = await db.query(UPDATE_GRADE_SECTION, [
    school_year_id,
    grade_n_strand_id,
    adviser_staff_id,
    section_name,
    description,
    id,
  ]);

  return result;
};

// DELETE
const deleteGradeSection = async (id) => {
  if (!id) {
    throw new Error("Grade section ID is required.");
  }

  const [result] = await db.query(DELETE_GRADE_SECTION, [id]);

  return result;
};

module.exports = {
  createGradeSection,
  findAllGradeSections,
  findGradeSectionById,
  findGradeSectionsBySchoolYear,
  findGradeSectionsByGradeNStrand,
  findGradeSectionsByAdviser,
  findGradeSection,
  updateGradeSection,
  deleteGradeSection,
};
