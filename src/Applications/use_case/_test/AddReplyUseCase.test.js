const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating AddReply by commentId action correctly', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const useCasePayload = {
      content: 'ini reply',
    };

    const addedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner,
    });

    const addReply = new AddReply(useCasePayload);
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getOwnerByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(owner));
    mockReplyRepository.addReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(addedReply));

    const getAddReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await getAddReplyUseCase.execute(addReply, { owner, commentId, threadId });
    expect(mockReplyRepository.addReplyByCommentId).toBeCalledWith(addReply, owner, commentId);
  });
});
