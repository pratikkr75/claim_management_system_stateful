import request from "supertest";
import app from '../app.js'; // Ensure this path is correct for your project structure

describe('Claim API Tests', () => {
    let claimId; // Variable to store claim ID for testing CRUD operations

    // Test POST (Create claim)
    it('should create a new claim', async () => {
        const res = await request(app)
            .post('/api/claims')
            .send({
                claimId: 'C123',
                policyId: 'P123',
                policyholderId: 'PH123',
                claimAmount: 5000,
                status: 'Pending'
            });
        expect(res.status).toBe(201);
        expect(res.body.claimId).toBe('C123');
        claimId = res.body._id; // Save the claim ID for further tests
    });

    // Test GET (Get all claims)
    it('should get all claims', async () => {
        const res = await request(app).get('/api/claims');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test GET (Get claim by ID)
    it('should get a claim by ID', async () => {
        const res = await request(app).get(`/api/claims/${claimId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(claimId);
    });

    // Test PUT (Update claim)
    it('should update a claim', async () => {
        const res = await request(app)
            .put(`/api/claims/${claimId}`)
            .send({
                status: 'Approved',
                claimAmount: 6000
            });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('Approved');
        expect(res.body.claimAmount).toBe(6000);
    });

    // Test DELETE (Delete claim)
    it('should delete a claim', async () => {
        const res = await request(app).delete(`/api/claims/${claimId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Claim deleted successfully');
    });
});
