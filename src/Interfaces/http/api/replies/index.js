const routes = require('./routes');
const ReplyCommentsHandler = require('./handler');

module.exports = {
  name: 'replies',
  register: async (server, { container }) => {
    const replyCommentsHandler = new ReplyCommentsHandler(container);
    server.route(routes(replyCommentsHandler));
  },
};
