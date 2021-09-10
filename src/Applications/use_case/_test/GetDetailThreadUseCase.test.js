const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating GetDetailThread Correctly', async () => {
    const threadId = 'thread-123';

    const getThreadById = {
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

    const listReply = [{
      id: 'reply-123',
      username: 'dicoding',
    }, {
      id: 'reply-234',
      username: 'dicoding',
    }];

    const arrayComment = listComment.map((comment) => {
      const replies = listReply;
      return {
        ...comment,
        replies,
      };
    });

    const expectedDetailThread = {
      ...getThreadById, comments: arrayComment,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(getThreadById));

    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(listComment));

    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(listReply));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const detailThread = await getDetailThreadUseCase.execute(threadId);
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
  });
});
