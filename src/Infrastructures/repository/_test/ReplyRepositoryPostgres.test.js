const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper.');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReplyByCommentId function', () => {
    it('should addReply when comment available', async () => {
      const owner = 'user-123';
      const commentId = 'comment-123';
      const threadId = 'thread-123';
      const payload = {
        content: 'isi reply',
      };

      const fakeIdGenerator = () => 123;
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);

      const addedReply = await replyRepositoryPostgres
        .addReplyByCommentId(payload, owner, commentId);
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: payload.content,
        owner,
      }));

      expect(reply).toHaveLength(1);
      expect(reply[0].content).toBe(payload.content);
    });
  });
});
