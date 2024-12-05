import multer from 'multer';  // Use import em vez de require
import path from 'path';

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Pasta onde os arquivos serão salvos
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Nome do arquivo
  },
});

// Filtragem de tipos de arquivos (opcional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf']; // Apenas PDF neste exemplo
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Tipo de arquivo não permitido'), false);
  }
  cb(null, true); // Permitir o arquivo
};

// Inicializar multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de tamanho de arquivo (10 MB)
});

export default upload;
