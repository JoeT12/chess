/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable(
    "roles",
    {
      id: "id",
      name: {
        type: "varchar(50)",
        notNull: true,
        unique: true,
      },
    },
    { ifNotExists: true }
  );

  pgm.sql(`
    INSERT INTO roles (id, name)
    VALUES (1, 'admin'), (2, 'user')
    ON CONFLICT (id) DO NOTHING;
  `);

  pgm.createTable(
    "users",
    {
      id: "id",
      email: {
        type: "varchar(100)",
        notNull: true,
        unique: true,
      },
      first_name: { type: "varchar(100)", notNull:true},
      last_name: {type: "varChar(100)", notNull:true},
      password: { type: "varchar(255)", notNull: true },
      role_id: {
        type: "integer",
        references: "roles(id)",
        notNull: true,
        onDelete: "CASCADE",
        default: 2, // We default to user role if no role specified
      },
    },
    { ifNotExists: true }
  );

  pgm.addConstraint("users", "email_format_check", {
    check: `"email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`,
  });

  // Refresh tokens table
  pgm.createTable('refresh_tokens', {
    id: { type: 'uuid', primaryKey: true },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    token_hash: { type: 'text', notNull: true },
    expires_at: { type: 'timestamp', notNull: true },
    revoked: { type: 'boolean', notNull: true, default: false },
    rotated_from: { type: 'uuid', references: '"refresh_tokens"(id)' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  // Indexes for faster lookups
  pgm.createIndex('refresh_tokens', 'user_id');
  pgm.createIndex('refresh_tokens', 'expires_at');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("refresh_tokens");
  pgm.dropTable("users");
  pgm.dropTable("roles");
};
