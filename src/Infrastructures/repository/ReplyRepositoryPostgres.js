const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplyByCommentId(addReply, owner, commentId) {
    const id = `reply-${this._idGenerator()}`;
    const { content } = addReply;

    const query = {
      text: 'INSERT INTO replies (id,content,owner,comment_id) VALUES ($1,$2,$3,$4) RETURNING id,content,owner',
      values: [id, content, owner, commentId],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }
}

module.exports = ReplyRepositoryPostgres;
