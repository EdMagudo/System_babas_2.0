import { Router } from "express";
import languagesController from "../Controllers/LanguagesController.js";

const router = Router();

router.post("/", languagesController.createLanguage); // Cria uma nova linguagem
router.get("/", languagesController.getAllLanguages); // Lista todas as linguagens
router.get("/:id", languagesController.getLanguageById); // Busca uma linguagem pelo ID
router.put("/:id", languagesController.updateLanguage); // Atualiza uma linguagem pelo ID
router.delete("/:id", languagesController.deleteLanguage); // Remove uma linguagem pelo ID

export default router;
