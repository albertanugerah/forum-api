class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ commentId, threadId, owner }) {
    const ownerComment = await this._commentRepository.getOwnerByCommentId(commentId);
    if (ownerComment !== owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_THE_COMMENT_OWNER');
    }
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
