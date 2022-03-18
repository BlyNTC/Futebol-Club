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
  it('/login ===> Se retorna o status correto ao não passar o email ',async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjQ3NDEzMzIzLCJleHAiOjE2NDgwMTgxMjN9.sF3AMkn4nqfkYnlhqQ24BHrGDW3Gy_WAtMotgplyXVw'
    responseChai = await chai
       .request(app).get('/login/validate').set('authorization', token)
       expect(responseChai).to.have.status(200)
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
    expect(responseChai.body).to.length(2)
  });
});

describe('Rota getById /clubs', () => {
  let responseChai: Response;
  before(async () => {
    sinon
      .stub(Club, "findOne")
      .resolves(mockClubs[0] as unknown as Club);
  });
 
  after(()=>{
    (Club.findOne as sinon.SinonStub).restore();
  })

  it('/clubs ==> o status na resposta  é o correto', async () => {
    responseChai = await chai.request(app).get('/clubs/1')
       expect(responseChai).to.have.status(200)
  });

  it('/clubs ==> vem o numero correto de usuarios',async () => {
    responseChai = await chai.request(app).get('/clubs/1')
    expect(responseChai.body.id).to.equal(mockClubs[0].id)
  });

  
  it('/clubs ==> se o parametro não for passado como string',async () => {
    responseChai = await chai.request(app).get('/clubs/asd')
    const errorMessage = { message: 'id must be a number' }
    
    expect(responseChai.body).to.deep.equal(errorMessage)
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
    responseChai = await chai.request(app).get('/matchs?inProgress=false')
    expect(responseChai.body).to.length(6)
  });

  it('/matchs ==> se passando a query inProgression=false ',async () => {
    responseChai = await chai.request(app).get('/matchs?inProgress=true')
    expect(responseChai.body).to.length(6)
  });
});

describe('Rota getById /matchs', () => {
  let responseChai: Response;
  before(async () => {
    sinon
      .stub(Match, "findOne")
      .resolves(mockMatchs[0] as unknown as Match);
  });
 
  after(()=>{
    (Match.findOne as sinon.SinonStub).restore();
  })

  it('/matchs ==> o status na resposta  é o correto', async () => {
    responseChai = await chai.request(app).get('/matchs/1')
       expect(responseChai).to.have.status(200)
  });

  it('/matchs ==>Se vem a partida correta',async () => {
    responseChai = await chai.request(app).get('/matchs/1')
    expect(responseChai.body.id).to.deep.equal(mockMatchs[0].id)
  });

  it('/matchs ==> vem o numero correto de usuarios',async () => {
    responseChai = await chai.request(app).get('/matchs/asd')
    const errorMessage = { message: 'id must be a number' }
    expect(responseChai.body).to.be.deep.equal(errorMessage)
  });
});

describe('Rota POST /matchs', () => {
  let responseChai: Response;
  before(async () => {
    sinon
      .stub(Match, "create")
      .resolves(mockMatchs[0] as unknown as Match);
    sinon
      .stub(Match, "findAll")
      .resolves([mockMatchs[0], mockMatchs[1]] as unknown as Club[]);
      sinon
      .stub(Club, "findAll")
      .resolves([mockClubs[0], mockClubs[1]] as unknown as Club[]);
  });
 
  after(()=>{
    (Match.create as sinon.SinonStub).restore();
    (Match.findAll as sinon.SinonStub).restore();
    (Club.findAll as sinon.SinonStub).restore();
  })

  it('/matchs ==> Se o status na resposta  é o correto', async () => {
    responseChai = await chai.request(app).post('/matchs').send(mockMatchs[0])
    
    expect(responseChai).to.have.status(201)
  });
  
  it('/matchs ==> Se vem o id da partida criada',async () => {
    responseChai = await chai.request(app).post('/matchs').send(mockMatchs[0])
    console.log('RESPONSE ==================>>>', responseChai.body);
    
    expect(responseChai.body.id).to.deep.equal(mockMatchs[0].id)
  });

});