const chai = require('chai');
const db = require('../db');

const { expect } = chai;

describe('Subject Routes', () => {
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

  describe('GET /subjects', () => {
    it('should retrive all subjects successfully', async () => {
      const response = await global.api.get('/subjects');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });

  describe('POST /subjects', () => {
    it('should create a subject successfully', async () => {
      const mockSubject = {
        name: 'Mock Subject',
        ects: 0,
      };

      const response = await global.api
        .post('/subjects')
        .set('Authorization', `Bearer ${admin.body.token}`)
        .send(mockSubject);

      expect(response.status).to.equal(201);
      expect(response.body.subject).to.be.an('array');
      expect(response.body.subject[0].name).to.equal(mockSubject.name);
    });

    it('should return a Forbidden error', async () => {
      const mockSubject = {
        name: 'Mock Subject',
        ects: 0,
      };

      const response = await global.api
        .post('/subjects')
        .set('Authorization', `Bearer ${student.body.token}`)
        .send(mockSubject);

      expect(response.status).to.equal(403);
    });

    it('should return a Unauthorized error', async () => {
      const mockSubject = {
        name: 'Mock Subject',
        ects: 0,
      };

      const response = await global.api.post('/subjects').send(mockSubject);

      expect(response.status).to.equal(401);
    });

    after(async () => {
      await db('subjects').where({ name: 'Mock Subject' }).del();
    });
  });

  describe('PUT /subjects/:id', () => {
    before(async () => {
      const mockSubject = {
        name: 'Mock Subject',
        ects: 0,
      };

      await global.api
        .post('/subjects')
        .set('Authorization', `Bearer ${admin.body.token}`)
        .send(mockSubject);
    });

    it('should update a subject', async () => {
      const subjects = await global.api.get('/subjects');

      const [subject] = await Promise.all(
        subjects.body.map(async (subj) => {
          if (subj.name === 'Mock Subject') {
            return subj;
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const response = await global.api
        .put(`/subjects/${subject.id}`)
        .set('Authorization', `Bearer ${admin.body.token}`)
        .send({ name: 'Mock Subject', ects: 4 });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Subject updated successfully');
    });

    it('should return a Forbidden error', async () => {
      const subjects = await global.api.get('/subjects');

      const [subject] = await Promise.all(
        subjects.body.map(async (subj) => {
          if (subj.name === 'Mock Subject') {
            return subj;
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const response = await global.api
        .put(`/subjects/${subject.id}`)
        .set('Authorization', `Bearer ${student.body.token}`)
        .send({ name: 'Mock Subject', ects: 4 });

      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('Admin access required');
    });

    it('should return a Unauthorized error', async () => {
      const subjects = await global.api.get('/subjects');

      const [subject] = await Promise.all(
        subjects.body.map(async (subj) => {
          if (subj.name === 'Mock Subject') {
            return subj;
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const response = await global.api
        .put(`/subjects/${subject.id}`)
        .send({ name: 'Mock Subject', ects: 4 });

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization header missing');
    });

    it('should return a Subject not found error', async () => {
      const response = await global.api
        .put(`/subjects/100`)
        .set('Authorization', `Bearer ${admin.body.token}`)
        .send({ name: 'Mock Subject', ects: 4 });

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Subject not found');
    });
  });

  describe('DELETE /subjects/:id', () => {
    before(async () => {
      const mockSubject = {
        name: 'Mock Subject',
        ects: 0,
      };

      await global.api
        .post('/subjects')
        .set('Authorization', `Bearer ${admin.body.token}`)
        .send(mockSubject);
    });

    it('should delete a subject', async () => {
      const subjects = await global.api.get('/subjects');

      const [subject] = await Promise.all(
        subjects.body.map(async (subj) => {
          if (subj.name === 'Mock Subject') {
            return subj;
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const response = await global.api
        .delete(`/subjects/${subject.id}`)
        .set('Authorization', `Bearer ${admin.body.token}`);

      expect(response.status).to.equal(204);
    });

    it('should return a Forbidden error', async () => {
      const subjects = await global.api.get('/subjects');

      const [subject] = await Promise.all(
        subjects.body.map(async (subj) => {
          if (subj.name === 'Mock Subject') {
            return subj;
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const response = await global.api
        .delete(`/subjects/${subject.id}`)
        .set('Authorization', `Bearer ${student.body.token}`)
        .send({ name: 'Mock Subject', ects: 4 });

      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('Admin access required');
    });

    it('should return a Unauthorized error', async () => {
      const subjects = await global.api.get('/subjects');

      const [subject] = await Promise.all(
        subjects.body.map(async (subj) => {
          if (subj.name === 'Mock Subject') {
            return subj;
          }
          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const response = await global.api.delete(`/subjects/${subject.id}`);

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization header missing');
    });

    after(async () => {
      await db('subjects').where({ name: 'Mock Subject' }).del();
    });
  });
});
