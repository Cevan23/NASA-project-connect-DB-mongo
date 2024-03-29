const request = require('supertest');
const app = require('../../app');
const { mongoConnect,
        mongoDisconnect, } = require('../../services/mongo');

describe('Lauches API', () => {

  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  }); 

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /(json|html)/)
        .expect(200);
    });
  });
  
  describe('Test POST /launch', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target:'Kepler-62 f',
      launchDate:'January 4, 2028'
  
    };
  
    const LaunchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target:'Kepler-62 f',
    }
  
    const LaunchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target:'Kepler-62 f',
      launchDate:'zoot'
    }
  
    test('it should be respond with 201 created', async () => {
      const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /(json|html)/)
        .expect(201);
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
  
      expect(response.body).toMatchObject(LaunchDataWithoutDate);
    });
  
    test ('it should catch missing required properties', async () => {
      const response = await request(app)
        .post('/launches')
        .send(LaunchDataWithoutDate)
        .expect('Content-Type', /(json|html)/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'missing data',
      });
    });
  
    test('it should catch invalid dates', async () => {
      const response = await request(app)
        .post('/launches')
        .send(LaunchDataWithInvalidDate)
        .expect('Content-Type', /(json|html)/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'missing data',
      });
    });
    
  });


});

