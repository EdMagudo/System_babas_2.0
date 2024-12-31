import { Router } from "express";
import reservationsController from "../Controllers/ReservationsController.js";

const router = Router();

router.post("/", reservationsController.createReservation); // Cria uma nova reserva
router.get("/", reservationsController.getAllReservations); // Lista todas as reservas
router.get("/:reservation_id", reservationsController.getReservationById); // Busca uma reserva pelo ID
router.put("/:reservation_id", reservationsController.updateReservation); // Atualiza uma reserva pelo ID
router.delete("/:reservation_id", reservationsController.deleteReservation); // Remove uma reserva pelo IDget

router.get("/getAll/reservations/:nanny_id", reservationsController.getAllReservationsForNanny )

router.get("/getAll/reservations/client/:client_id", reservationsController.getAllReservationsForClient )

router.put("/cancel/reservation/:id_reservation", reservationsController.cancelReservation)

router.get("/getAll/reservations",reservationsController.countConfirmedAndBookedReservations)



export default router;
