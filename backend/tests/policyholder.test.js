import request from "supertest";
import app from '../app.js'; // Ensure this path is correct for your project structure

describe('Policyholder API Tests', () => {
    let policyholderEmail;

    // Test POST (Create policyholder)
    it('should create a new policyholder', async () => {
        const res = await request(app)
            .post('/api/policyholders')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                phone: '1234567890'
            });
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('John Doe');
        policyholderEmail = res.body.email; // Save the policyholder ID for further tests
    });

    // Test GET (Get all policyholders)
    it('should get all policyholders', async () => {
        const res = await request(app).get('/api/policyholders');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test GET (Get policyholder by ID)
    it('should get a policyholder by ID', async () => {
        const res = await request(app).get(`/api/policyholders/${policyholderEmail}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(policyholderEmail);
    });

    // Test PUT (Update policyholder)
    it('should update a policyholder', async () => {
        const res = await request(app)
            .put(`/api/policyholders/${policyholderEmail}`)
            .send({
                phone: '0987654321'
            });
        expect(res.status).toBe(200);
        expect(res.body.phone).toBe('0987654321');
    });

    // Test DELETE (Delete policyholder)
    it('should delete a policyholder', async () => {
        const res = await request(app).delete(`/api/policyholders/${policyholderEmail}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Policyholder deleted successfully');
    });
});
