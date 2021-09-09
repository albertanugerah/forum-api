const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper.');
const createServer = require('../createServer');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should response 201 when thread or comment exist', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'isi reply',
    };

    await UsersTableTestHelper.addUser({ id: owner });
    await ThreadTableTestHelper.addThread(threadId, {}, owner);
    await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);

    const server = await createServer(container);
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload,
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
    expect(responseJson.data.addedReply).toBeDefined();
  });
  it('should response 404 when thread not exist', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'isi reply',
    };

    await UsersTableTestHelper.addUser({ id: owner });

    const server = await createServer(container);
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload,
      auth: {
        strategy: 'forum_api_jwt',
        credentials: {
          id: owner,
        },
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(404);
    expect(responseJson.status).toEqual('fail');
  });
  it('should response 404 when comment not exist', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'isi reply',
    };

    await UsersTableTestHelper.addUser({ id: owner });
    await ThreadTableTestHelper.addThread(threadId, {}, owner);

    const server = await createServer(container);
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload,
      auth: {
        strategy: 'forum_api_jwt',
        credentials: {
          id: owner,
        },
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(404);
    expect(responseJson.status).toEqual('fail');
  });
  it('should response 401 when unauthorized', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'isi reply',
    };

    await UsersTableTestHelper.addUser({ id: owner });
    await ThreadTableTestHelper.addThread(threadId, {}, owner);
    await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);

    const server = await createServer(container);
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload,
    });

    expect(response.statusCode).toEqual(401);
  });
  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 when reply exist', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const payload = {
        content: 'isi balasan',
      };

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);
      await RepliesTableTestHelper.addReply(replyId, payload, owner, commentId);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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
    it('should response 404 when reply not exist', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 401 when unauthorized', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const payload = {
        content: 'isi balasan',
      };

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);
      await RepliesTableTestHelper.addReply(replyId, payload, owner, commentId);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });

      expect(response.statusCode).toEqual(401);
    });
    it('should response 403 when when reply owner is not the user', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const fakeId = 'user-4321';
      const payload = {
        content: 'isi balasan',
      };

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);
      await RepliesTableTestHelper.addReply(replyId, payload, owner, commentId);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: fakeId,
          },
        },
      });

      expect(response.statusCode).toEqual(403);
    });
  });
});
