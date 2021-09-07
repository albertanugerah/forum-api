const createServer = require('../createServer');
const container = require('../../container');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and added thread', async () => {
      // Arrange
      const owner = 'user-123';
      const payload = {
        title: 'title',
        body: 'dummy body',
      };
      await UsersTableTestHelper.addUser({ id: owner });

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: owner,
          },
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThreadd).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(payload.title);
    });
  });
});
