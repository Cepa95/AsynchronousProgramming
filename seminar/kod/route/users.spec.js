const chai = require('chai');
const db = require('../db');

const { expect } = chai;

describe('User Routes', () => {
  let admin;
  let student;

  before(async () => {
    admin = await global.api
      .post('/login')
      .send({ email: 'admin@gmail.com', password: '123' });

    student = await global.api
      .post('/login')
      .send({ email: 'bruno@gmail.com', password: '123' });
  });

  describe('GET /users', () => {
    it('should retrive all Users successfully', async () => {
      const response = await global.api
        .get('/users')
        .set('Authorization', `Bearer ${admin.body.token}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });

    it('should return a Forbidden error', async () => {
      const response = await global.api
        .get('/users')
        .set('Authorization', `Bearer ${student.body.token}`);

      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('Admin access required');
    });

    it('should return a Unauthorized error', async () => {
      const response = await global.api.get('/users');

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization header missing');
    });
  });

  describe('POST /users', () => {
    const mockUser = {
      name: 'Mock',
      email: 'mock_user@example.com',
      password: 'student',
      role: 'student',
    };

    it('should create a new User successfully', async () => {
      const response = await global.api
        .post('/users')
        .set('Authorization', `Bearer ${admin.body.token}`)
        .send(mockUser);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
    });

    it('should return a Forbidden error', async () => {
      const response = await global.api
        .post('/users')
        .set('Authorization', `Bearer ${student.body.token}`)
        .send(mockUser);

      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('Admin access required');
    });

    it('should return a Unauthorized error', async () => {
      const response = await global.api.post('/users').send(mockUser);

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization header missing');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a User successfully', async () => {
      const mockUser = await global.api
        .post('/login')
        .send({ email: 'mock_user@example.com', password: 'student' });

      const response = await global.api
        .put(`/users/${mockUser.body.user.id}`)
        .set('Authorization', `Bearer ${mockUser.body.token}`)
        .send({ name: 'Mock', email: 'mock_user@example.com' });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('User updated successfully');
    });

    it('should return a Forbidden error', async () => {
      const users = await global.api
        .get('/users')
        .set('Authorization', `Bearer ${admin.body.token}`);

      const [user] = await Promise.all(
        users.body.map(async (user) => {
          if (user.name === 'Mock') {
            return user;
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const response = await global.api
        .put(`/users/${user.id}`)
        .set('Authorization', `Bearer ${student.body.token}`)
        .send({ name: 'Mock User', email: 'mock_user@example.com' });

      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal(
        'Forbidden: You can only update your own data'
      );
    });

    it('should return a Unauthorized error', async () => {
      const users = await global.api
        .get('/users')
        .set('Authorization', `Bearer ${admin.body.token}`);

      const [user] = await Promise.all(
        users.body.map(async (user) => {
          if (user.name === 'Mock') {
            return user;
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const response = await global.api
        .put(`/users/${user.id}`)
        .send({ name: 'Mock', email: 'mock_user@example.com' });

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization header missing');
    });
  });

  describe('DELETE /users/:id', () => {
    const mockUser = {
      name: 'Mock',
      email: 'mock_user@example.com',
      password: 'student',
      role: 'student',
    };

    it('should delete a User successfully', async () => {
      await global.api
        .post('/users')
        .set('Authorization', `Bearer ${admin.body.token}`)
        .send(mockUser);

      const users = await global.api
        .get('/users')
        .set('Authorization', `Bearer ${admin.body.token}`);

      const [user] = await Promise.all(
        users.body.map(async (user) => {
          if (user.email === 'mock_user@example.com') {
            return user;
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const response = await global.api
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${admin.body.token}`);

      expect(response.status).to.equal(204);
    });

    it('should return a Forbidden error', async () => {
      await global.api
        .post('/users')
        .set('Authorization', `Bearer ${admin.body.token}`)
        .send(mockUser);

      const users = await global.api
        .get('/users')
        .set('Authorization', `Bearer ${admin.body.token}`);

      const [user] = await Promise.all(
        users.body.map(async (user) => {
          if (user.email === 'mock_user@example.com') {
            return user;
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const response = await global.api
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${student.body.token}`);

      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('Admin access required');
    });

    it('should return a Unauthorized error', async () => {
      await global.api
        .post('/users')
        .set('Authorization', `Bearer ${admin.body.token}`)
        .send(mockUser);

      const users = await global.api
        .get('/users')
        .set('Authorization', `Bearer ${admin.body.token}`);

      const [user] = await Promise.all(
        users.body.map(async (user) => {
          if (user.email === 'mock_user@example.com') {
            return user;
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const response = await global.api.delete(`/users/${user.id}`);

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization header missing');
    });
  });

  after(async () => {
    await db('users').where({ email: 'mock_user@example.com' }).del();
  });
});
