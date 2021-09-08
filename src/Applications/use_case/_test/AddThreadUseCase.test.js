const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const owner = 'user-123';
    const useCasePayload = {
      title: 'ini title',
      body: 'ini Body',
    };

    const expectedCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner,
    });

    /** creating dependency of use case */

    const mockThreadRepository = new ThreadRepository();

    /**  mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedThread));

    /** createing use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdThread = await getThreadUseCase
      .execute(useCasePayload, owner);

    // Assert
    expect(createdThread).toStrictEqual(expectedCreatedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new CreateThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), owner);
  });
});
