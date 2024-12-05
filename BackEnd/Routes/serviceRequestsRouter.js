import { Router } from "express";
import serviceRequestsController from "../Controllers/ServiceRequestsController.js";

const router = Router();

router.post("/", serviceRequestsController.createRequest); // Cria uma nova solicitação de serviço
router.get("/", serviceRequestsController.getAllRequests); // Lista todas as solicitações de serviço
router.get("/:request_id", serviceRequestsController.getRequestById); // Obtém os detalhes de uma solicitação específica
router.put("/:request_id", serviceRequestsController.updateRequest); // Atualiza uma solicitação existente
router.delete("/:request_id", serviceRequestsController.deleteRequest); // Exclui uma solicitação de serviço

export default router;
