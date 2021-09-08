/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'DATE',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"threads"',
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: 'false',
    },
  });
  // menambahkan foreign key pada owner kolom id dari table users
  pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
