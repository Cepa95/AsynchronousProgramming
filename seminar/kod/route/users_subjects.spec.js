const chai = require('chai');
const db = require('../db');

const { expect } = chai;

describe('User Subject Routes', () => {
  let admin;
  let student;
  let mockUser;
  let mockSubject;
  let subject;

  before(async () => {
    admin = await global.api
      .post('/login')
      .send({ email: 'admin@gmail.com', password: '123' });

    student = await global.api
      .post('/login')
      .send({ email: 'bruno@gmail.com', password: '123' });

    const mockUserTemp = await global.api
      .post('/users')
      .set('Authorization', `Bearer ${admin.body.token}`)
      .send({
        name: 'Mock',
        email: 'mock@example.com',
        password: 'student',
        role: 'student',
      });

    mockUser = await global.api
      .post('/login')
      .send({ email: 'mock@example.com', password: 'student' });

    mockSubject = await global.api
      .post('/subjects')
      .set('Authorization', `Bearer ${admin.body.token}`)
      .send({
        name: 'Mock Subject',
        ects: 0,
      });

    const response = await global.api.get('/subjects');
    subject = await response.body[0];
  });

  describe('GET /subjects/:id/users', () => {
    it('should retrive all Users assigned to selected subject', async () => {
      const response = await global.api
        .get(`/subjects/${subject.id}/users`)
        .set('Authorization', `Bearer ${admin.body.token}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });

    it('should return a Forbidden error', async () => {
      const response = await global.api
        .get(`/subjects/${subject.id}/users`)
        .set('Authorization', `Bearer ${student.body.token}`);

      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('Admin access required');
    });

    it('should return a Unauthorized error', async () => {
      const response = await global.api.get(`/subjects/${subject.id}/users`);

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization header missing');
    });
  });

  describe('GET /users/:id/subjects', () => {
    it('should retrive all Subjects assigned to selected user', async () => {
      const response = await global.api
        .get(`/users/${student.body.user.id}/subjects`)
        .set('Authorization', `Bearer ${student.body.token}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });

    it('should return a Forbidden error', async () => {
      const response = await global.api
        .get(`/users/${student.body.user.id}/subjects`)
        .set('Authorization', `Bearer ${admin.body.token}`);

      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal(
        'Forbidden: You can only see your own data'
      );
    });

    it('should return a Unauthorized error', async () => {
      const response = await global.api.get(
        `/users/${student.body.user.id}/subjects`
      );

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization header missing');
    });
  });

  describe('POST /subjects/:id/add', () => {
    it('should assign a User to selected subject', async () => {
      const response = await global.api
        .post(`/subjects/${mockSubject.body.subject[0].id}/add`)
        .set('Authorization', `Bearer ${mockUser.body.token}`);

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal(
        'User added to subject successfully'
      );
    });

    it('should return a User already assigned error', async () => {
      const response = await global.api
        .post(`/subjects/${mockSubject.body.subject[0].id}/add`)
        .set('Authorization', `Bearer ${mockUser.body.token}`);

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal(
        'User is already added to this subject'
      );
    });

    it('should return a Unauthorized error', async () => {
      const response = await global.api.post(
        `/subjects/${mockSubject.body.subject[0].id}/add`
      );

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization header missing');
    });
  });

  describe('DELETE /subjects/:id/remove', () => {
    it('should unassign a User from selected subject', async () => {
      const response = await global.api
        .delete(`/subjects/${mockSubject.body.subject[0].id}/remove`)
        .set('Authorization', `Bearer ${mockUser.body.token}`);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal(
        'User removed from subject successfully'
      );
    });

    it('should return a User is not assigned error', async () => {
      const response = await global.api
        .delete(`/subjects/${mockSubject.body.subject[0].id}/remove`)
        .set('Authorization', `Bearer ${mockUser.body.token}`);

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('User is not added to this subject');
    });

    it('should return a Unauthorized error', async () => {
      const response = await global.api.delete(
        `/subjects/${mockSubject.body.subject[0].id}/remove`
      );

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization header missing');
    });
  });
  after(async () => {
    await db('users').where({ email: 'mock@example.com' }).del();
    await db('subjects').where({ name: 'Mock Subject' }).del();
  });
});
