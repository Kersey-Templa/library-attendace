// CREATE
const CREATE_ACCOUNT = `
  INSERT INTO accounts (username, password)
  VALUES (?, ?)
`;

// READ - Get all accounts
const FIND_ALL_ACCOUNTS = `
  SELECT
    a.id,
    a.username,
    a.created_at,
    a.updated_at
  FROM accounts AS a
  ORDER BY a.id DESC
`;

// READ - Get account by ID
const FIND_ACCOUNT_BY_ID = `
  SELECT
    a.id,
    a.username,
    a.created_at,
    a.updated_at
  FROM accounts AS a
  WHERE a.id = ?
`;

// READ - Get account by username
// Used for authentication
const FIND_ACCOUNT_BY_USERNAME = `
  SELECT
    a.id,
    a.username,
    a.password,
    a.created_at,
    a.updated_at
  FROM accounts AS a
  WHERE a.username = ?
`;

// UPDATE
const UPDATE_ACCOUNT = `
  UPDATE accounts AS a
  SET
    a.username = ?,
    a.password = ?
  WHERE a.id = ?
`;

// DELETE
const DELETE_ACCOUNT = `
  DELETE FROM accounts
  WHERE id = ?
`;

module.exports = {
  CREATE_ACCOUNT,
  FIND_ALL_ACCOUNTS,
  FIND_ACCOUNT_BY_ID,
  FIND_ACCOUNT_BY_USERNAME,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
};
