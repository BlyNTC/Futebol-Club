import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';

import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User';
import UserMock from './mockUser'

const { user, admin } = UserMock;

const { validUser, invalidUser } = user;

const { validAdmin, invalidAdmin } = admin;

import { Response } from 'superagent';
import { response } from 'express';

chai.use(chaiHttp);

const { expect } = chai;

describe('Seu teste', () => {
  let responseChai: Response;
  before(async () => {
    sinon
      .stub(User, "findOne")
      .resolves(validAdmin as any);
  });

  after(()=>{
    (User.findOne as sinon.SinonStub).restore();
  })

  it('Se status é o correto', async () => {
    responseChai = await chai
       .request(app).post('/login').send({ email: validAdmin.email,
        password: validAdmin.password })
        console.log('CONSOLE.LOG --------------------------------------------------------------', responseChai);
       expect(responseChai).to.have.status(200)
  });

  it('Se o usuario é o correto',async () => {
    responseChai = await chai
       .request(app).post('/login').send({ email: validAdmin.email,
        password: validAdmin.password })
        console.log(responseChai);
       expect(responseChai).to.property('email').contain('admin@admin.com')
  });
  it('Sem passar o email',async () => {
    responseChai = await chai
       .request(app).post('/login').send({ password: validAdmin.password })
        console.log(responseChai);
       expect(responseChai).to.have.status(401)
  });
});
