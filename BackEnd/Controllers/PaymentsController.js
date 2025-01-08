import db from "../Models/index.js";
const Payments = db.Payments;
const Reservations = db.Reservations;
const Users = db.Users;

import { Op } from 'sequelize';
import moment from 'moment'; 


// Obter todos os pagamentos
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payments.findAll();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter um pagamento por ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payments.findByPk(req.params.id);
    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um pagamento
const updatePayment = async (req, res) => {
  try {
    const [updated] = await Payments.update(req.body, {
      where: { payment_id: req.params.id },
    });
    if (updated) {
      const updatedPayment = await Payments.findByPk(req.params.id);
      res.status(200).json(updatedPayment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar um pagamento
const deletePayment = async (req, res) => {
  try {
    const deleted = await Payments.destroy({
      where: { payment_id: req.params.id },
    });
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllPaymentsWithDetails = async (req, res) => {
  try {
    const payments = await Payments.findAll({
      include: [
        {
          model: Reservations,
          as: 'reservation',
        },
      ],
    });

    // Obter detalhes adicionais do cliente e da babá
    const detailedPayments = await Promise.all(
      payments.map(async (payment) => {
        const reservation = payment.reservation;

        // Buscar cliente
        const client = await Users.findOne({
          where: { user_id: reservation.client_id },
          attributes: ['first_name', 'last_name'],
        });

        // Buscar babá
        const nanny = await Users.findOne({
          where: { user_id: reservation.nanny_id },
          attributes: ['first_name', 'last_name'],
        });

        return {
          ...payment.toJSON(),
          client: client ? client.toJSON() : null,
          nanny: nanny ? nanny.toJSON() : null,
        };
      })
    );

    res.status(200).json(detailedPayments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTotalCompletedPayments = async (req, res) => {
  try {
    console.log('Calculating total amount of completed payments for the current month');

    // Obter o primeiro e o último dia do mês atual
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    // Somando os valores dos pagamentos com status 'completed' no mês atual
    const totalAmount = await Payments.sum('amount', {
      where: {
        status: 'completed', // Filtra os pagamentos com status 'completed'
        payment_date: { // Filtra pela data de pagamento dentro do mês atual
          [Op.between]: [startOfMonth, endOfMonth]
        }
      },
    });

    // Retorna o valor total dos pagamentos com status 'completed' para o mês atual
    res.json({ totalAmount });
  } catch (error) {
    console.error('Error calculating total completed payments:', error);
    res.status(500).json({ error: 'Error calculating total completed payments' });
  }
};



export default {
   getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getAllPaymentsWithDetails,
  getTotalCompletedPayments
};
