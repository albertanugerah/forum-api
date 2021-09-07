/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread(id, {
    title = 'sebuah thread',
    body = 'sebuah body',
  }, owner) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
      values: [id, title, body, owner],
    };

    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async getThreadByOwner(owner) {
    const query = {
      text: 'SELECT * FROM threads WHERE owner = $1',
      values: [owner],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
