// CREATE
const CREATE_GRADE_N_STRAND = `
  INSERT INTO grade_n_strands (
    grade_level,
    strand,
    description
  )
  VALUES (?, ?, ?)
`;

// READ - Get all grade levels and strands
const FIND_ALL_GRADE_N_STRANDS = `
  SELECT
    gns.id,
    gns.grade_level,
    gns.strand,
    gns.description,
    gns.created_at,
    gns.updated_at
  FROM grade_n_strands AS gns
  ORDER BY gns.id DESC
`;

// READ - Get grade level and strand by ID
const FIND_GRADE_N_STRAND_BY_ID = `
  SELECT
    gns.id,
    gns.grade_level,
    gns.strand,
    gns.description,
    gns.created_at,
    gns.updated_at
  FROM grade_n_strands AS gns
  WHERE gns.id = ?
`;

// READ - Get by grade level and strand
const FIND_GRADE_N_STRAND = `
  SELECT
    gns.id,
    gns.grade_level,
    gns.strand,
    gns.description,
    gns.created_at,
    gns.updated_at
  FROM grade_n_strands AS gns
  WHERE gns.grade_level = ?
    AND gns.strand = ?
`;

// UPDATE
const UPDATE_GRADE_N_STRAND = `
  UPDATE grade_n_strands
  SET
    grade_level = ?,
    strand = ?,
    description = ?
  WHERE id = ?
`;

// DELETE
const DELETE_GRADE_N_STRAND = `
  DELETE FROM grade_n_strands
  WHERE id = ?
`;

module.exports = {
  CREATE_GRADE_N_STRAND,
  FIND_ALL_GRADE_N_STRANDS,
  FIND_GRADE_N_STRAND_BY_ID,
  FIND_GRADE_N_STRAND,
  UPDATE_GRADE_N_STRAND,
  DELETE_GRADE_N_STRAND,
};
