// CREATE
const CREATE_STAFF = `
  INSERT INTO staffs (
    account_id,
    role_id,
    lastname,
    firstname,
    contact_no,
    email
  )
  VALUES (?, ?, ?, ?, ?, ?)
`;

// READ - Get all staffs
const FIND_ALL_STAFFS = `
  SELECT
    s.id,
    s.account_id,
    s.role_id,
    s.lastname,
    s.firstname,
    s.contact_no,
    s.email,
    s.created_at,
    s.updated_at
  FROM staffs AS s
  ORDER BY s.id DESC
`;

// READ - Get staff by ID
const FIND_STAFF_BY_ID = `
  SELECT
    s.id,
    s.account_id,
    s.role_id,
    s.lastname,
    s.firstname,
    s.contact_no,
    s.email,
    s.created_at,
    s.updated_at
  FROM staffs AS s
  WHERE s.id = ?
`;

// READ - Get staff by account ID
const FIND_STAFF_BY_ACCOUNT_ID = `
  SELECT
    s.id,
    s.account_id,
    s.role_id,
    s.lastname,
    s.firstname,
    s.contact_no,
    s.email,
    s.created_at,
    s.updated_at
  FROM staffs AS s
  WHERE s.account_id = ?
`;

// READ - Get staff by email
const FIND_STAFF_BY_EMAIL = `
  SELECT
    s.id,
    s.account_id,
    s.role_id,
    s.lastname,
    s.firstname,
    s.contact_no,
    s.email,
    s.created_at,
    s.updated_at
  FROM staffs AS s
  WHERE s.email = ?
`;

// UPDATE
const UPDATE_STAFF = `
  UPDATE staffs
  SET
    account_id = ?,
    role_id = ?,
    lastname = ?,
    firstname = ?,
    contact_no = ?,
    email = ?
  WHERE id = ?
`;

// DELETE
const DELETE_STAFF = `
  DELETE FROM staffs
  WHERE id = ?
`;

module.exports = {
  CREATE_STAFF,
  FIND_ALL_STAFFS,
  FIND_STAFF_BY_ID,
  FIND_STAFF_BY_ACCOUNT_ID,
  FIND_STAFF_BY_EMAIL,
  UPDATE_STAFF,
  DELETE_STAFF,
};
