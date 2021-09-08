const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, { owner, threadId }) {
    await this._threadRepository.getThreadById(threadId);

    const addComment = new AddComment(useCasePayload);
    const result = await this._commentRepository.addCommentByThreadId(addComment, owner, threadId);
    return result;
  }
}

module.exports = AddCommentUseCase;
