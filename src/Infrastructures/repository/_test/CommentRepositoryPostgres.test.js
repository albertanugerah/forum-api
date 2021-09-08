const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper.');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentByThreadId', () => {
    it('should addComment and return addedComment correctly', async () => {
      const addComment = new AddComment({
        content: 'ini content',
      });
      const threadId = 'thread-123';
      const owner = 'user-123';
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {
        title: 'ini title',
        body: 'ini body',
      }, owner);

      const addedComment = await commentRepositoryPostgres
        .addCommentByThreadId(addComment, owner, threadId);
      const comment = await CommentsTableTestHelper.findCommentsById('comment-123');

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'ini content',
        owner,
      }));
      expect(comment).toHaveLength(1);
    });
  });
});
