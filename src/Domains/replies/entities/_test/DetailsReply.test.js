const DetailsReply = require('../DetailsReply');

describe('DetailsReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
    };
    expect(() => new DetailsReply(payload)).toThrowError('DETAILS_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'dicoding',
      date: 122,
      content: 'sebuah comment',
      isDeleted: 'false',
    };
    expect(() => new DetailsReply(payload)).toThrowError('DETAILS_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create detailReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'sebuah comment',
      isDeleted: false,
    };
    const {
      id, username, date, replies, content,
    } = new DetailsReply(payload);
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
    expect(content).toEqual(payload.content);
  });
});
