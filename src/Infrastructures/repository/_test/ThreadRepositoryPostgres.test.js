const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
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

  describe('verifyThreadOwner function', () => {
    it('should throw AuthorizationError when verifyOwnerThread', async () => {
      // Arrange
      const id = 'thread-123';
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: owner,
        username: 'dicoding',
      });// memasukan user baru dengan username dicoding
      await ThreadsTableTestHelper.addThread(id, {
        title: 'ini title',
        body: 'ini body',
      }, owner);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadOwner('thread-123', 'user-234')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when verifyOwnerThread', async () => {
      // Arrange
      const id = 'thread-123';
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: owner,
        username: 'dicoding',
      });// memasukan user baru dengan username dicoding
      await ThreadsTableTestHelper.addThread(id, {
        title: 'ini title',
        body: 'ini body',
      }, owner);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadOwner('thread-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
    it('should throw NotFoundError when threads not available ', async () => {
      // Arrange
      const id = 'thread-123';
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: owner,
        username: 'dicoding',
      });// memasukan user baru dengan username dicoding
      await ThreadsTableTestHelper.addThread(id, {
        title: 'ini title',
        body: 'ini body',
      }, owner);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadOwner('thread-234', 'user-123')).rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when threads no available ', async () => {
      // Arrange
      const id = 'thread-123';
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: owner,
        username: 'dicoding',
      });// memasukan user baru dengan username dicoding
      await ThreadsTableTestHelper.addThread(id, {
        title: 'ini title',
        body: 'ini body',
      }, owner);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadOwner('thread-123', 'user-123')).resolves.not.toThrowError(NotFoundError);
    });
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
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-222'))
        .rejects
        .toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      const id = 'thread-123';
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: owner,
        username: 'dicoding',
      });
      await ThreadsTableTestHelper.addThread(id, {
        title: 'ini title',
        body: 'ini body',
      }, owner);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});
