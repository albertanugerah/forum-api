const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating GetDetailThread Correctly', async () => {
    const threadId = 'thread-123';

    const expectedDetailThread = {
      id: threadId,
      title: 'ini judul',
      body: 'isi body',
      username: 'dicoding',
    };

    const listComment = [{
      id: 'comment-123',
      username: 'dicoding',
    }, {
      id: 'comment-321',
      username: 'dicoding',
    }, {
      id: 'comment-234',
      username: 'dicoding',
    }];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailThread));

    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(listComment));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await getDetailThreadUseCase.execute(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
  });
});
