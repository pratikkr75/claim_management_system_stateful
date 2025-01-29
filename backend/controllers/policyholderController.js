import Policyholder from '../models/policyholder.model.js';

class PolicyholderController {
    // Method to get a policyholder by ID
    static getPolicyholderById(req, res) {
        const policyholder = Policyholder.findById(req.params.id);
        if (!policyholder) {
            return res.status(404).json({ error: 'Policyholder not found' });
        }
        return res.status(200).json(policyholder);
    }

    // Method to create a new policyholder
    static createPolicyholder(req, res) {
        const { firstName, lastName, email } = req.body;

        // Check if the email already exists
        const existingPolicyholder = Policyholder.findByEmail(email);
        if (existingPolicyholder) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Create a new policyholder and add to mock data
        const newPolicyholder = new Policyholder(
            firstName,
            lastName,
            email
        );

        Policyholder.save(newPolicyholder);
        return res.status(201).json(newPolicyholder);
    }

    // Method to update a policyholder's details
    static updatePolicyholder(req, res) {
        const { firstName, lastName, email } = req.body;
        const policyholder = Policyholder.findById(req.params.id);
        if (!policyholder) {
            return res.status(404).json({ error: 'Policyholder not found' });
        }

        // Update the policyholder details
        policyholder.firstName = firstName || policyholder.firstName;
        policyholder.lastName = lastName || policyholder.lastName;
        if (email) {
            // Ensure the email is unique
            const existingPolicyholder = Policyholder.findByEmail(email);
            if (existingPolicyholder && existingPolicyholder.id !== policyholder.id) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            policyholder.email = email;
        }
        policyholder.updatedAt = new Date();

        return res.status(200).json(policyholder);
    }

    // Method to delete a policyholder by ID
    static deletePolicyholder(req, res) {
        const success = Policyholder.deleteById(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Policyholder not found' });
        }
        return res.status(204).send();
    }
}

export default PolicyholderController;
