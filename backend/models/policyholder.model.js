// Import necessary libraries
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

// Simulating in-memory storage for Policyholder data
const policyholders = [];

class Policyholder {
    constructor(firstName, lastName, email) {
        this.id = uuidv4(); // Automatically generate a UUID for the policyholder
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Static method to validate email using validator.js
    static validateEmail(email) {
        return validator.isEmail(email);
    }

    // Save the policyholder to the "in-memory" array
    static save(policyholder) {
        // Validate email before saving
        if (!Policyholder.validateEmail(policyholder.email)) {
            throw new Error('Invalid email format');
        }

        // Save the policyholder
        policyholders.push(policyholder);
    }

    // Static method to find a policyholder by ID
    static findById(id) {
        return policyholders.find(ph => ph.id === id);
    }

    // Static method to find a policyholder by email
    static findByEmail(email) {
        return policyholders.find(ph => ph.email === email);
    }

    // Method to update policyholder details
    updateDetails(firstName, lastName, email) {
        if (email && !Policyholder.validateEmail(email)) {
            throw new Error('Invalid email format');
        }

        this.firstName = firstName || this.firstName;
        this.lastName = lastName || this.lastName;
        this.email = email || this.email;
        this.updatedAt = new Date();
    }

    // Static method to delete a policyholder by ID
    static deleteById(id) {
        const index = policyholders.findIndex(ph => ph.id === id);
        if (index !== -1) {
            policyholders.splice(index, 1);
            return true;
        }
        return false;
    }
}

export default Policyholder;
