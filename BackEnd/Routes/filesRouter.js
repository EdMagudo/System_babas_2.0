import { Router } from "express";
import filesController from "../Controllers/FilesController.js";

const router = Router();

router.post("/", filesController.createFile); // Cria um novo arquivo
router.get("/", filesController.getAllFiles); // Lista todos os arquivos
router.get("/:id", filesController.getFileById); // Busca um arquivo pelo ID
router.put("/:id", filesController.updateFile); // Atualiza um arquivo pelo ID
router.delete("/:id", filesController.deleteFile); // Remove um arquivo pelo ID

export default router;
