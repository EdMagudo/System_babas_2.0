import { Router } from "express";
import userLanguageController from "../Controllers/UserLanguageController.js";

const router = Router();

router.post("/", userLanguageController.createUserLanguage); // Cria uma associação entre usuário e idioma
router.get("/", userLanguageController.getAllUserLanguages); // Lista todas as associações de usuários com idiomas
router.get("/user/:user_id", userLanguageController.getUserLanguagesByUserId); // Busca os idiomas associados a um usuário
router.delete("/:user_id/:language_id", userLanguageController.deleteUserLanguage); // Remove a associação de idioma de um usuário

export default router;
