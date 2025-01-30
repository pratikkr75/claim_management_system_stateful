import Policyholder from "../models/policyholder.model.js";

class PolicyholderController {
  // Create a new policyholder
  async createPolicyholder(req, res) {
    try {
      const { firstName, lastName, email } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: "All fields are required." });
      }

      // Check if email is already in use
      const existingPolicyholder = await Policyholder.findOne({ email });
      if (existingPolicyholder) {
        return res.status(400).json({ error: "Email already in use." });
      }

      // Create and save the new policyholder
      const newPolicyholder = await Policyholder.create({
        firstName,
        lastName,
        email,
      });

      return res.status(201).json(newPolicyholder); // Respond with created policyholder
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get a policyholder by ID
  async getPolicyholderById(req, res) {
    try {
      const policyholder = await Policyholder.findOne({ id: req.params.id });

      if (!policyholder) {
        return res.status(404).json({ error: "Policyholder not found." });
      }

      return res.status(200).json(policyholder);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update a policyholder
  async updatePolicyholder(req, res) {
    try {
      const { firstName, lastName, email } = req.body;
      const policyholder = await Policyholder.findOne({ id: req.params.id });

      if (!policyholder) {
        return res.status(404).json({ error: "Policyholder not found." });
      }

      if (email) {
        // Check if email is valid and not already in use by another policyholder
        const existingPolicyholder = await Policyholder.findOne({
          email,
          id: { $ne: req.params.id },
        });
        if (existingPolicyholder) {
          return res.status(400).json({ error: "Email already in use." });
        }
      }

      // Update the policyholder details
      policyholder.firstName = firstName || policyholder.firstName;
      policyholder.lastName = lastName || policyholder.lastName;
      policyholder.email = email || policyholder.email;

      await policyholder.save();

      return res.status(200).json(policyholder);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Delete a policyholder by ID
  async deletePolicyholder(req, res) {
    try {
      const policyholder = await Policyholder.findOneAndDelete({
        id: req.params.id,
      });

      if (!policyholder) {
        return res.status(404).json({ error: "Policyholder not found." });
      }

      return res.status(204).send(); // No content
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

const policyholderController = new PolicyholderController();
export default policyholderController;
