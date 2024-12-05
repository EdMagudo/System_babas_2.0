import db from "../Models/index.js";
const Reservations = db.Reservations;

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
    const reservations = await Reservations.findAll();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

export default {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
};
