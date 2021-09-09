const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');

class ReplyCommentsHandler {
  constructor(container) {
    this._container = container;

    this.postReplyCommentHandler = this.postReplyCommentHandler.bind(this);
  }

  async postReplyCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addReplyUseCase = await this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase
      .execute(request.payload, { owner, commentId, threadId });
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = ReplyCommentsHandler;
