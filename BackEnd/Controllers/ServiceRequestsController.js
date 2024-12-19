import { now } from "sequelize/lib/utils";
import db from "../Models/index.js";
import { Sequelize } from 'sequelize';
const ServiceRequest = db.Service_Requests;
const Reservation = db.Reservations;

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

const getRequestsForNanny = async (req, res) => {
  try {
    console.log('Fetching requests for nanny with ID:', req.params.nanny_id);
    const requests = await ServiceRequest.findAll({
      where: { nanny_id: req.params.nanny_id },
      order: [['start_date', 'ASC']],
    });
    console.log('Requests found:', requests);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests for nanny:', error);
    res.status(500).json({ error: 'Error fetching requests for nanny' });
  }
};

const rejectRequest = async (req, res) => {
  console.log('Rejecting request for nanny with ID:', req.params);
  const { id } = req.params; // Obtenha o ID da requisição a partir dos parâmetros
  try {
    // Encontre a solicitação pelo ID e atualize o status para 'rejected'
    const updatedRows = await ServiceRequest.update(
      { status: 'rejected' },
      { where: { request_id: id } }
    );

    if (updatedRows[0] === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Error rejecting request' });
  }
};

const approvedRequest = async (req, res) => {
  console.log('Rejecting request for nanny with ID:', req.params);
  const { id } = req.params; // Obtenha o ID da requisição a partir dos parâmetros
  try {
    // Encontre a solicitação pelo ID e atualize o status para 'rejected'
    const updatedRows = await ServiceRequest.update(
      { status: 'approved' },
      { where: { request_id: id } }
    );

    if (updatedRows[0] === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const approvedRequest = await ServiceRequest.findOne({
      where: { request_id: id },
    });

    if (!approvedRequest) {
      return res.status(404).json({ message: 'Request not found after update' });
    }

    // Crie uma reserva automaticamente com os detalhes da solicitação
    const newReservation = await Reservation.create({
      request_id: approvedRequest.request_id,
      nanny_id : approvedRequest.nanny_id,
      value: req.body.value || 0, // Use o valor fornecido ou 0 como padrão
      status: 'confirmed',
      booking_date:approvedRequest.start_date, //
    });
    res.status(200).json({
      message: 'Request approved and reservation created successfully',
      reservation: newReservation,
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Error rejecting request' });
  }
};



export default {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  getRequestsForNanny,
  rejectRequest,
  approvedRequest
};
