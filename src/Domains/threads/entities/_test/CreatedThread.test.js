const CreatedThread = require('../CreatedThread');

describe('a CreatedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'ini_title',
    };
    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'ini_title',
      owner: true,
    };
    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'ini_title',
      owner: 'user-123',
    };

    // Action
    const createdThread = new CreatedThread(payload);

    // Assert
    expect(createdThread.id).toEqual(payload.id);
    expect(createdThread.title).toEqual(payload.title);
    expect(createdThread.owner).toEqual(payload.owner);
  });
});
