CREATE TABLE tenant (
  id INTEGER PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT NULL
);

CREATE TABLE customer (
  id INTEGER PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  name TEXT DEFAULT NULL,
  tokens_invalid_before TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT NULL,
  last_login_at TEXT DEFAULT NULL,
  FOREIGN KEY(tenant_id) REFERENCES tenant(id)
);

CREATE INDEX customer_email ON customer(email);

CREATE TABLE player (
  id INTEGER PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  handle TEXT NOT NULL,
  fullname TEXT DEFAULT NULL,
  avatar BLOB DEFAULT NULL,
  created_by INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT NULL,
  FOREIGN KEY(tenant_id) REFERENCES tenant(id),
  FOREIGN KEY(created_by) REFERENCES customer(id)
);

CREATE TABLE venue (
  id INTEGER PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  handle TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar BLOB DEFAULT NULL,
  created_by INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT NULL,
  FOREIGN KEY(tenant_id) REFERENCES tenant(id),
  FOREIGN KEY(created_by) REFERENCES user(id)
);

CREATE TABLE ruleset (
  id INTEGER PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  handle TEXT NOT NULL,
  name TEXT NOT NULL,
  pile INTEGER NOT NULL,
  bonus INTEGER NOT NULL,
  created_by INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT NULL,
  FOREIGN KEY(tenant_id) REFERENCES tenant(id),
  FOREIGN KEY(created_by) REFERENCES user(id)
);
