import db from "../Models/index.js";
const ServiceRequest = db.Service_Requests;

const createRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.findAll();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findByPk(req.params.request_id);
    if (request) {
      res.status(200).json(request);
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const [updated] = await ServiceRequest.update(req.body, {
      where: { request_id: req.params.request_id },
    });
    if (updated) {
      const updatedRequest = await ServiceRequest.findByPk(req.params.request_id);
      res.status(200).json(updatedRequest);
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const deleted = await ServiceRequest.destroy({
      where: { request_id: req.params.request_id },
    });
    if (deleted) {
      res.status(204).json({ message: "Request deleted" });
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
};
