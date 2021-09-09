const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailsReply = require('../../Domains/replies/entities/DetailsReply');

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

  async getReplyByCommentId(commentId) {
    const query = {
      text: 'SELECT replies.*,users.username AS username FROM replies INNER JOIN users ON replies.owner = users.id WHERE replies.comment_id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rows.map((payload) => new DetailsReply({
      ...payload,
      date: new Date(payload.date).toISOString(),
      isDeleted: payload.is_deleted,
    }));
  }
}

module.exports = ReplyRepositoryPostgres;
