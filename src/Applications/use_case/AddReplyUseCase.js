const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyReposistory = replyRepository;
  }

  async execute(useCasePayload, { owner, commentId, threadId }) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getOwnerByCommentId(commentId);

    const addReply = new AddReply(useCasePayload);
    return this._replyReposistory.addReplyByCommentId(addReply, owner, commentId);
  }
}

module.exports = AddReplyUseCase;
