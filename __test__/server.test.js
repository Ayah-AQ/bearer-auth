'use strict'

const { app } = require("../src/server");
const { db } = require("../src/auth/models");
const supertest = require('supertest');
const mock = supertest(app);
const base64 = require('base-64')
const basicAuthMiddleWare = require('../src/auth/middleware/basicAuth')

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});
  
// Test endpoints
describe('Test the signin & signup endpoints', () => {

  it(' POST to /signup to create a new user.  ', async () => {
    const result = await mock.post('/signup').send({
      username: 'aya',
      password: '1234'
    });
    expect(result.status).toEqual(201);
  });

  it('POST to /signin to login as a user (use basic auth).  ', async () => {
    const req = {
      headers: {
        authorization: `Basic ${base64.encode('aya:1234')}`
      },
      body: {
        username: undefined
      }
    };

    const res = {};
    const next = jest.fn();
    await basicAuthMiddleWare(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});