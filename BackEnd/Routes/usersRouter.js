import { Router } from "express";
import usersController from "../Controllers/UsersController.js";

const router = Router();

router.post("/", usersController.createUser); // Cria um novo usuário
router.get("/", usersController.getAllUsers); // Lista todos os usuários
router.get("/:user_id", usersController.getUserById); // Obtém os detalhes de um usuário específico
router.put("/:user_id", usersController.updateUser); // Atualiza um usuário existente
router.delete("/:user_id", usersController.deleteUser); // Exclui um usuário

export default router;
