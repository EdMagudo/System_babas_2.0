import express from "express";
import NannyController from "../Controllers/NannyController.js";
import multer from "multer";

const router = express.Router();

// Configuração do multer para upload de arquivos
const upload = multer({
  dest: "uploads", // Diretório onde os arquivos serão armazenados
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de tamanho: 5 MB
  fileFilter: (req, file, cb) => {
    // Filtra os arquivos permitidos
    const allowedTypes = ["application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Only JPEG, PNG, and PDF are allowed."));
    }
  },
});

// Middleware para manipulação de erros de upload
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "File upload error", error: err.message });
  } else if (err) {
    return res.status(400).json({ message: "File validation error", error: err.message });
  }
  next();
};

// Rota para registrar uma babá (nanny) com uploads de arquivos
router.post(
  "/register",
  upload.fields([
    { name: "idCopy", maxCount: 1 },
    { name: "policeClearanceCopy", maxCount: 1 },
  ]),
  handleUploadErrors,
  NannyController.registerNanny
);

// Rota para obter o perfil de uma babá pelo ID
router.get("/profile/:id", NannyController.getNannyById);

// Rota para obter todas as babás
router.get("/profiles", NannyController.getAllNannies);

// Rota para atualizar o perfil de uma babá pelo ID (a ser implementado futuramente)
// router.put("/profile/:id", upload.none(), NannyController.updateNannyProfile);

// Exportando as rotas
export default router;
