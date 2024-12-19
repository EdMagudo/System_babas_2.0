import db from "../Models/index.js";
const Reservations = db.Reservations;
const ServiceRequest = db.Service_Requests;
const Users = db.Users;

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

const getAllReservationsForNanny = async (req, res) => {
  try {
    console.log('Fetching all reservations with service request and user data');

    // Buscando todas as reservas, incluindo dados da request e do usuário (client)
    const reservations = await Reservations.findAll({
      include: [
        {
          model: ServiceRequest,
          as: 'serviceRequest',  // Nome da associação (verifique se está configurado no seu modelo)
          include: [
            {
              model: Users,  // Nome do modelo de Users (cliente)
              as: 'client',  // Nome da associação (verifique se está configurado no seu modelo)
            }
          ]
        }
      ],
      order: [['booking_date', 'ASC']]  // Ordenar pelas datas de reserva
    });

    // Verificando se há reservas encontradas
    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found' });
    }

    console.log('Reservations found:', reservations);

    // Retornando as reservas encontradas com os dados relacionados
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching all reservations:', error);
    res.status(500).json({ error: 'Error fetching all reservations' });
  }
};

const cancelReservation = async (req, res) => {
  console.log('Canceling reservation with ID:', req.params.id_reservation);
 
  try {
    // Encontre a reserva pelo ID e atualize o status para 'cancelled'
    const updatedRows = await Reservations.update(
      { status: 'cancelled' },
      { where: { reservation_id: req.params.id_reservation } }
    );

    if (updatedRows[0] === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Error canceling reservation:', error);
    res.status(500).json({ message: 'Error canceling reservation' });
  }
};


export default {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  getAllReservationsForNanny,
  cancelReservation
};
