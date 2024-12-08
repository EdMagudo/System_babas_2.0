import { Router } from "express";
import multer from "multer";
import usersController from "../Controllers/UsersController.js";
import upload from "../Middlewares/upload.js"; // Importa a configuração existente de `multer`

const router = Router();

// Rotas com upload configurado
router.post("/", upload.single('file'), usersController.createUser);
router.post('/register', upload.fields([{ name: 'idCopy', maxCount: 1 }]), usersController.createNannyUser);

// Rotas sem upload
router.post('/login', usersController.loginUser);
router.get("/", usersController.getAllUsers);
router.get("/:user_id", usersController.getUserById);
router.put("/:user_id", usersController.updateUser);
router.delete("/:user_id", usersController.deleteUser);

// Rota de atualização de perfil (usando `multer` básico para processar `multipart/form-data`)
const basicUpload = multer(); // Configuração básica do multer
// Configuração para aceitar o upload de um único arquivo (por exemplo, policeClearanceFile)
router.put("/updatenannyProfiles/:id_user", upload.single('policeClearanceFile'), usersController.updatedProfile);


export default router;
