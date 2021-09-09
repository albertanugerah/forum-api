class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const comments = await this._commentRepository.getCommentByThreadId(threadId);

    const listComment = await Promise.all(comments.map(async (comment) => ({ ...comment })));

    const thread = await this._threadRepository.getThreadById(threadId);
    return {
      ...thread,
      comments: listComment,
    };
  }
}

module.exports = GetDetailThreadUseCase;
