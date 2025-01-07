import db from "../Models/index.js";
const Reservations = db.Reservations;
const ServiceRequest = db.Service_Requests;
const Users = db.Users;

import { Sequelize } from "sequelize";
const { Op } = Sequelize;

const createReservation = async (req, res) => {
  try {
    const reservation = await Reservations.create(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReservations = async (req, res) => {
  try {
    console.log("Fetching all reservations with service request and user data");

    // Fetching all reservations, including service request and client data
    const reservations = await Reservations.findAll({
      include: [
        {
          model: ServiceRequest,
          as: "serviceRequest", // Ensure this matches your association name
          include: [
            {
              model: Users, // Ensure this matches your Users model name
              as: "client", // Ensure this matches your association name
            },
          ],
        },
      ],
      order: [["booking_date", "ASC"]], // Sorting by booking date in ascending order
    });

    // Check if no reservations were found
    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: "No reservations found" });
    }

    console.log("Reservations found:", reservations);

    // Return reservations with related data
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    res.status(500).json({ error: "Error fetching all reservations" });
  }
};

const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservations.findByPk(req.params.reservation_id);
    if (reservation) {
      res.status(200).json(reservation);
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReservation = async (req, res) => {
  try {
    const [updated] = await Reservations.update(req.body, {
      where: { reservation_id: req.params.reservation_id },
    });
    if (updated) {
      const updatedReservation = await Reservations.findByPk(
        req.params.reservation_id
      );
      res.status(200).json(updatedReservation);
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const deleted = await Reservations.destroy({
      where: { reservation_id: req.params.reservation_id },
    });
    if (deleted) {
      res.status(204).json({ message: "Reservation deleted" });
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReservationsForNanny = async (req, res) => {
  try {
    console.log("Fetching all reservations with service request and user data");

    // Fetching all reservations, including service request and client data
    const reservations = await Reservations.findAll({
      include: [
        {
          model: ServiceRequest,
          as: "serviceRequest", // Ensure this matches your association name
          include: [
            {
              model: Users, // Ensure this matches your Users model name
              as: "client", // Ensure this matches your association name
            },
          ],
        },
      ],
      where: { nanny_id: req.params.nanny_id }, // Corrected syntax
      order: [["booking_date", "ASC"]], // Sorting by booking date in ascending order
    });

    // Check if no reservations were found
    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: "No reservations found" });
    }

    console.log("Reservations found:", reservations);

    // Return reservations with related data
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    res.status(500).json({ error: "Error fetching all reservations" });
  }
};

const getAllReservationsForClient = async (req, res) => {
  try {
    console.log("Fetching all reservations with service request and user data");

    // Fetching all reservations, including service request and client data
    const reservations = await Reservations.findAll({
      include: [
        {
          model: ServiceRequest,
          as: "serviceRequest", // Ensure this matches your association name
          include: [
            {
              model: Users, // Ensure this matches your Users model name
              as: "client", // Ensure this matches your association name
            },
          ],
        },
      ],
      where: { client_id: req.params.client_id }, // Corrected syntax
      order: [["booking_date", "ASC"]], // Sorting by booking date in ascending order
    });

    // Check if no reservations were found
    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: "No reservations found" });
    }

    console.log("Reservations found:", reservations);

    // Return reservations with related data
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    res.status(500).json({ error: "Error fetching all reservations" });
  }
};

const cancelReservation = async (req, res) => {
  console.log("Canceling reservation with ID:", req.params.id_reservation);

  try {
    // Encontre a reserva pelo ID e atualize o status para 'cancelled'
    const updatedRows = await Reservations.update(
      { status: "cancelled" },
      { where: { reservation_id: req.params.id_reservation } }
    );

    if (updatedRows[0] === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Error canceling reservation:", error);
    res.status(500).json({ message: "Error canceling reservation" });
  }
};

const countConfirmedAndBookedReservations = async (req, res) => {
  try {
    console.log("Counting confirmed and booked reservations");

    // Contando as reservas com status 'confirmed' ou 'booked'
    const count = await Reservations.count({
      where: {
        status: {
          [Sequelize.Op.in]: ["confirmed", "booked"], // Filtra os status confirmed e booked
        },
      },
    });

    // Retorna o número de reservas com status 'confirmed' ou 'booked'
    res.json({ count });
  } catch (error) {
    console.error("Error counting confirmed and booked reservations:", error);
    res
      .status(500)
      .json({ error: "Error counting confirmed and booked reservations" });
    
  }
};

const payReservation = async (req, res) => {
  console.log("Canceling reservation with ID:", req.params.id_reservation);

  try {
    // Encontre a reserva pelo ID e atualize o status para 'cancelled'
    const updatedRows = await Reservations.update(
      { status: "booked" },
      { where: { reservation_id: req.params.id_reservation } }
    );

    if (updatedRows[0] === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Error canceling reservation:", error);
    res.status(500).json({ message: "Error canceling reservation" });
  }
};

export default {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  getAllReservationsForNanny,
  cancelReservation,
  getAllReservationsForClient,
  countConfirmedAndBookedReservations,
  payReservation,
};
