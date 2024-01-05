const request = require('supertest');
const app=require('../index')

describe('Authentication Controller', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/signup').send({
        name:'user',
        username: 'testuser',
        password: 'testpassword',
      });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });
  
    it('should not register a user with an existing username', async () => {
      const response = await request(app).post('/api/auth/signup').send({
        name:'user1',
        username: 'testuser',
        password: 'newpassword',
      });
      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('error');
    });
  
    it('should login with the registered user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: 'testuser',
        password: 'testpassword',
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  
    it('should not login with invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: 'testuser',
        password: 'wrongpassword',
      });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid username or password');
    });
});
describe('Authentication Controller Integration Tests', () => {
  it('should register a new user and then login with the registered user', async () => {
    // Register a new user
    const registrationResponse = await request(app)
      .post('/api/auth/signup')
      .send({name:'user', username: 'testuser', password: 'testpassword' });
    expect(registrationResponse.statusCode).toBe(201);
    expect(registrationResponse.body).toHaveProperty('message', 'User registered successfully');

    // Login with the registered user
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
  });

  it('should not register a user with an existing username', async () => {
    // Attempt to register a user with the same username
    const response = await request(app)
      .post('/api/auth/signup')
      .send({name:'user', username: 'testuser', password: 'newpassword' });
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('error');
  });

  it('should not login with invalid credentials', async () => {
    // Attempt to login with invalid credentials
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid username or password');
  });
});