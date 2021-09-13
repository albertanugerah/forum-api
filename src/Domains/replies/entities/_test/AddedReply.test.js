const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'ini_content',
    };
    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    expect(() => new AddedReply({ id: 123, content: 'ini_content', owner: 'true' }))
      .toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedReply({ id: '123', content: true, owner: 'true' }))
      .toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedReply({ id: '123', content: 'ini_content', owner: true }))
      .toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      content: 'ini_content',
      owner: 'user-123',
    };

    // Action
    const createdThread = new AddedReply(payload);

    // Assert
    expect(createdThread.id).toEqual(payload.id);
    expect(createdThread.content).toEqual(payload.content);
    expect(createdThread.owner).toEqual(payload.owner);
  });
});
