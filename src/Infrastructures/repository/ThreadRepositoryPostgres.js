const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(createThread, owner) {
    const {
      title, body,
    } = createThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads (id,title,body,owner) VALUES($1, $2, $3, $4) RETURNING id,title,owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new CreatedThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: 'SELECT threads.*, users.username AS username FROM threads JOIN users ON threads.owner = users.id WHERE threads.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread is not found');
    }
    return new DetailThread({
      ...result.rows[0],
      date: new Date(result.rows[0].date).toISOString(),
    });
  }
}

module.exports = ThreadRepositoryPostgres;
