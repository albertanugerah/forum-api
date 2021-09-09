const pool = require('../../database/postgres/pool');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper.');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comments', async () => {
      const requestPayload = {
        content: 'ini content',
      };
      const owner = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({
        id: owner,
        username: 'albert',
        password: 'rahasia',
      });
      await ThreadTableTestHelper.addThread(threadId, {
        title: 'sebuah thread',
        body: 'sebuah body',
      }, owner);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });
  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentTableTestHelper.addComment(commentId, {}, owner, threadId);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
