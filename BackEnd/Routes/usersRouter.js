import upload from '../Middlewares/upload.js'; // Caminho para o arquivo de configuração do multer
import { Router } from "express";
import usersController from '../Controllers/UsersController.js';

const router = Router();

// Rota de criação de usuário com upload de arquivo
router.post("/", upload.single('file'), usersController.createUser);
router.post("/nanny", upload.single('file'), usersController.createNannyUser);
router.get("/", usersController.getAllUsers); // Lista todos os usuários
router.get("/:user_id", usersController.getUserById); // Obtém os detalhes de um usuário específico
router.put("/:user_id", usersController.updateUser); // Atualiza um usuário existente
router.delete("/:user_id", usersController.deleteUser); // Exclui um usuário

export default router;
