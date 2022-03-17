import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';

import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User';
import UserMock from './mockUser'
import mockMatchs from './mockMatchs';
import mockClubs from './mockClubs';
const { user, admin } = UserMock;

const { validUser, invalidUser } = user;

const { validAdmin, invalidAdmin } = admin;

import { Response } from 'superagent';
import { response } from 'express';
import Club from '../database/models/Club';
import Match from '../database/models/Match';

chai.use(chaiHttp);

const { expect } = chai;

describe(' Rota login', () => {
  let responseChai: Response;
  before(async () => {
    sinon
      .stub(User, "findOne")
      .resolves(validAdmin as any);
  });

  after(()=>{
    (User.findOne as sinon.SinonStub).restore();
  })

  it('/login ===> O status é o correto', async () => {
    responseChai = await chai
       .request(app).post('/login').send({ email: validAdmin.email,
        password: validAdmin.password })
       expect(responseChai).to.have.status(200)
  });

  it('/login ===> se o usuario retornado é o correto',async () => {
    responseChai = await chai
       .request(app).post('/login').send({ email: validAdmin.email,
        password: validAdmin.password })        
       expect(responseChai.body.user).to.have.property('email').to.contains(validAdmin.email)
  });
  it('/login ===> Se retorna o status correto ao não passar o email ',async () => {
    responseChai = await chai
       .request(app).post('/login').send({ password: validAdmin.password })
       expect(responseChai).to.have.status(401)
  });
});
describe('Rota getAll /clubs', () => {
  let responseChai: Response;
  before(async () => {
    sinon
      .stub(Club, "findAll")
      .resolves([validAdmin, validUser] as any[]);
  });

  after(()=>{
    (Club.findAll as sinon.SinonStub).restore();
  })

  it('/clubs ==> o status na resposta  é o correto', async () => {
    responseChai = await chai.request(app).get('/clubs')
       expect(responseChai).to.have.status(200)
  });

  it('/clubs ==> vem o numero correto de usuarios',async () => {
    responseChai = await chai.request(app).get('/clubs')
    console.log('RESPONSE ================>>>>',responseChai.body);
    expect(responseChai.body).to.length(2)
  });
});

describe('Rota get/matchs', () => {
  let responseChai: Response;
  before(async () => {
    sinon
      .stub(Match, "findAll")
      .resolves(mockMatchs as any[]);
  });

  after(()=>{
    (Match.findAll as sinon.SinonStub).restore();
  })

  it('/matchs ==> o status na resposta  é o correto', async () => {
    responseChai = await chai.request(app).get('/matchs')
       expect(responseChai).to.have.status(200)
  });

  it('/matchs ==> se recebe o número correto de partidas',async () => {
    responseChai = await chai.request(app).get('/matchs')
    expect(responseChai.body).to.length(6)
  });

  it('/matchs ==> se passando a query inProgression=true ',async () => {
    responseChai = await chai.request(app).get('/matchs?inProgression=true')
    expect(responseChai.body).to.length(6)
  });

  it('/matchs ==> se passando a query inProgression=false ',async () => {
    responseChai = await chai.request(app).get('/matchs?inProgression=false')
    expect(responseChai.body).to.length(6)
  });
});
