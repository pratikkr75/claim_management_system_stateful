import request from "supertest";
import app from '../app.js'; // Ensure this path is correct for your project structure

describe('Policy API Tests', () => {
    let policyId;

    // Test POST (Create policy)
    it('should create a new policy', async () => {
        const res = await request(app)
            .post('/api/policies')
            .send({
                policyId: 'P123',
                policyholderId: 'PH123',
                coverageAmount: 100000,
                policyType: 'Health'
            });
        expect(res.status).toBe(201);
        expect(res.body.policyId).toBe('P123');
        policyId = res.body._id; // Save the policy ID for further tests
    });

    // Test GET (Get all policies)
    it('should get all policies', async () => {
        const res = await request(app).get('/api/policies');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test GET (Get policy by ID)
    it('should get a policy by ID', async () => {
        const res = await request(app).get(`/api/policies/${policyId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(policyId);
    });

    // Test PUT (Update policy)
    it('should update a policy', async () => {
        const res = await request(app)
            .put(`/api/policies/${policyId}`)
            .send({
                coverageAmount: 120000
            });
        expect(res.status).toBe(200);
        expect(res.body.coverageAmount).toBe(120000);
    });

    // Test DELETE (Delete policy)
    it('should delete a policy', async () => {
        const res = await request(app).delete(`/api/policies/${policyId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Policy deleted successfully');
    });
});
