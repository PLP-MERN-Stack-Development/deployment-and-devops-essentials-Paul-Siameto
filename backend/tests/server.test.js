const request = require('supertest');
const app = require('../server');

describe('Server API Tests', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/api');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('MERN Deployment API');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/users', () => {
    it('should return users array', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });
  });
});
