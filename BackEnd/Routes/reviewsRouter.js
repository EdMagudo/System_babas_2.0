import { Router } from "express";
import reviewsController from "../Controllers/ReviewsController.js";

const router = Router();

router.post("/", reviewsController.createReview); // Cria uma nova avaliação
router.get("/", reviewsController.getAllReviews); // Lista todas as avaliações
router.get("/:review_id", reviewsController.getReviewById); // Busca uma avaliação por ID
router.get("/user/:user_id", reviewsController.getReviewsByUser); // Busca todas as avaliações feitas para um usuário
router.put("/:review_id", reviewsController.updateReview); // Atualiza uma avaliação pelo ID
router.delete("/:review_id", reviewsController.deleteReview); // Remove uma avaliação pelo ID

export default router;
