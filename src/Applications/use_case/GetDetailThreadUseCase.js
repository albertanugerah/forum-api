class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const comments = await this._commentRepository.getCommentByThreadId(threadId);
    const listComment = await Promise.all(comments.map(async (comment) => {
      const replies = await this._replyRepository.getReplyByCommentId(comment.id);
      return {
        ...comment,
        replies,
      };
    }));

    const thread = await this._threadRepository.getThreadById(threadId);
    return {
      ...thread,
      comments: listComment,
    };
  }
}

module.exports = GetDetailThreadUseCase;
