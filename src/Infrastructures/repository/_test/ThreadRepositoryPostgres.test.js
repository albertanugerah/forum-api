const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist addThread correctly', async () => {
      // Arrange

      const createThread = new CreateThread({
        title: 'ini title',
        body: 'ini body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: owner,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(createThread, owner);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
    it('should return created thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      const createThread = new CreateThread({
        title: 'ini title',
        body: 'ini body',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const owner = 'user-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(createThread, owner);

      // Assert
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'ini title',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError if thread not available', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepository.getThreadById('thread-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if thread available', async () => {
      const threadId = 'thread-123';
      const owner = 'user-123';
      const payload = {
        id: threadId,
        title: 'coba thread',
        body: 'isi thread',
        username: 'userCoba',
      };

      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: owner, username: payload.username });
      await ThreadsTableTestHelper.addThread(threadId, {
        title: payload.title,
        body: payload.body,
      }, owner);

      const thread = await threadRepository.getThreadById('thread-123');

      await expect(threadRepository.getThreadById('thread-123'))
        .resolves.not.toThrow(NotFoundError);
      expect(thread).toHaveProperty('id');
      expect(thread).toHaveProperty('title');
      expect(thread).toHaveProperty('body');
      expect(thread).toHaveProperty('username');
      expect(thread).toHaveProperty('date');
    });
  });
});
