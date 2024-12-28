const chai = require('chai');
const db = require('../db');

const { expect } = chai;

describe('Authorization Routes', () => {
  describe('POST /register', () => {
    it('should register a user successfully', async () => {
      const mockUser = {
        name: 'Jhon',
        email: 'john@example.com',
        password: 'student',
      };

      const response = await global.api.post('/register').send(mockUser);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('id');
    });

    it('should return an error if email already exists', async () => {
      const mockUser = {
        name: 'Jhon',
        email: 'john@example.com',
        password: 'student',
      };

      const response = await global.api.post('/register').send(mockUser);

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal(
        'User with this email already exists'
      );
    });
  });

  describe('POST /login', () => {
    it('should login successfully and return a token', async () => {
      const mockUser = {
        email: 'john@example.com',
        password: 'student',
      };

      const response = await global.api.post('/login').send(mockUser);

      expect(response.status).to.equal(200);
      expect(response.body).contains.keys('token');
    });

    it('should return an error for invalid email', async () => {
      const response = await global.api.post('/login').send({
        email: 'invalid@example.com',
        password: 'password123',
      });

      expect(response.status).to.equal(401);
      expect(response.body.error).to.equal('User not found');
    });

    it('should return an error for invalid password', async () => {
      const mockUser = {
        email: 'john@example.com',
        password: 'invalid_password',
      };

      const response = await global.api.post('/login').send(mockUser);

      expect(response.status).to.equal(401);
      expect(response.body.error).to.equal('Invalid password');
    });
  });

  after(async () => {
    await db('users').where({ email: 'john@example.com' }).del();
  });
});
