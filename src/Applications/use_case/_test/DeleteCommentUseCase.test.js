const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommnetRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly ', async () => {
    const owner = 'user-123';
    const commentId = 'comment-123';
    const threadId = 'thread-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getOwnerByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(owner));

    const getDeleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await getDeleteCommentUseCase.execute({ commentId, threadId, owner });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(commentId);
    expect(mockCommentRepository.getOwnerByCommentId).toBeCalledWith(commentId);
  });
  it('should throw error when deleting not owner comment', async () => {
    const owner = 'user-123';
    const fakeOwner = 'user-321';
    const commentId = 'comment-123';
    const threadId = 'thread-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getOwnerByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(owner));

    const getDeleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(getDeleteCommentUseCase.execute({ commentId, threadId, fakeOwner }))
      .rejects.toThrowError(Error);
    expect(mockCommentRepository.getOwnerByCommentId).toBeCalledWith(commentId);
  });
});
