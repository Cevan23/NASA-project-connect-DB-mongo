const request = require('supertest');
const app = require('../../app');

describe('Test Get  /plannet',( )=>{
    test('It should response with 200 success', async ()=>{
        const response = await request(app).get('/planet');
        expect(response.statusCode).toBe(200);
    });
})