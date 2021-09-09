const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyCommentsHandler {
  constructor(container) {
    this._container = container;

    this.postReplyCommentHandler = this.postReplyCommentHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
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

  async deleteReplyByIdHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { replyId, commentId, threadId } = request.params;
    const deleteReplyUseCase = await this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({
      replyId, commentId, threadId, owner,
    });
    return {
      status: 'success',
    };
  }
}

module.exports = ReplyCommentsHandler;
