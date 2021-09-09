const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentByThreadId(addComment, owner, threadId) {
    const id = `comment-${this._idGenerator()}`;
    const { content } = addComment;

    const query = {
      text: 'INSERT INTO comments (id,content,owner,thread_id)VALUES($1,$2,$3,$4) RETURNING id,content,owner',
      values: [id, content, owner, threadId],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async getOwnerByCommentId(commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment is not found');
    }

    return result.rows[0].owner;
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted= true WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak di temukan');
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: 'SELECT comments.*, users.username AS username FROM comments INNER JOIN users ON comments.owner = users.id WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((payload) => (new DetailComment({
      ...payload,
      date: new Date(payload.date).toISOString(),
      isDeleted: payload.is_deleted,
    })));
  }
}

module.exports = CommentRepositoryPostgres;
