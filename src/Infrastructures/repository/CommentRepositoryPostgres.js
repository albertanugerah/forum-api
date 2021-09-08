const CommentRepository = require('../../Domains/comments/CommnetRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

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
}

module.exports = CommentRepositoryPostgres;
