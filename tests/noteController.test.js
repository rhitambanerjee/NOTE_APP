// tests/noteController.integration.test.js
const request = require('supertest');
const app = require('../index'); 

let authToken; // To store the token for authenticated requests
let createdNoteId; // To store the ID of the note created during testing

beforeAll(async () => {
  // Login and get the token
  const response = await request(app).post('/api/auth/login').send({
    username: 'testuser',
    password: 'testpassword',
  });
  authToken = response.body.token;

  // Create a new note for update and delete tests
  const noteResponse = await request(app)
    .post('/api/notes')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ title: 'Note for Update and Delete', content: 'This note will be used for update and delete tests' });
  createdNoteId = noteResponse.body.note._id;
});

describe('Notes Controller Integration Tests', () => {
  it('should create a new note, update, delete, share, and search for it', async () => {
    // Create a new note
    const createResponse = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Integration Test Note', content: 'This is an integration test note' });
    expect(createResponse.statusCode).toBe(201);
    const noteId = createResponse.body.note._id;

    // Update the created note
    const updateResponse = await request(app)
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Updated Integration Test Note', content: 'This note has been updated for testing' });
    expect(updateResponse.statusCode).toBe(200);

    // Share the created note
    const shareResponse = await request(app)
      .post(`/api/notes/${noteId}/share`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ sharedUserId: '<USER_ID_TO_SHARE_WITH>' }); // Replace with an actual user ID
    expect(shareResponse.statusCode).toBe(200);

    // Search for the created note
    const searchResponse = await request(app)
      .get('/api/notes/search')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ query: 'Updated Integration Test Note' });
    expect(searchResponse.statusCode).toBe(200);
    expect(searchResponse.body).toBeInstanceOf(Array);
    expect(searchResponse.body.length).toBeGreaterThan(0);

    // Delete the created note
    const deleteResponse = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(deleteResponse.statusCode).toBe(200);
  });

  it('should not update a non-existent note by ID', async () => {
    const response = await request(app)
      .put('/api/notes/invalidNoteId')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Invalid Update', content: 'This update should not happen' });
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Note not found');
  });

  it('should not delete a non-existent note by ID', async () => {
    const response = await request(app)
      .delete('/api/notes/invalidNoteId')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Note not found');
  });
});
