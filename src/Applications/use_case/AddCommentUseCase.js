const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addCommentByThreadId(useCasePayload, { owner, threadId }) {
    await this._threadRepository.getThreadById(threadId);

    const addComment = new AddComment(useCasePayload);
    return this._commentRepository.addCommentByThreadId(addComment, owner, threadId);
  }
}

module.exports = AddCommentUseCase;
