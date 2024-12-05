import db from "../Models/index.js";
import multer from "multer";
const File = db.Files;  // Supondo que você tenha definido o modelo `File` no Sequelize
const User = db.Users;  // Para garantir que o user_id seja válido

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Diretório onde os arquivos serão armazenados
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nome do arquivo
  }
});

// Verificação de tipo de arquivo e tamanho
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('O arquivo deve ser no formato PDF.'), false);
  }
};

// Limitar o tamanho do arquivo para 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
});

// Criar um novo arquivo (upload)
const createFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
    }

    const { user_id } = req.body;

    // Verificar se o usuário existe
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Criar o registro do arquivo no banco
    const fileData = {
      user_id: user_id,
      file_name: req.file.originalname,
      file_path: req.file.path,
      file_type: req.file.mimetype,
    };

    const file = await File.create(fileData);
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar todos os arquivos de um usuário
const getFilesByUserId = async (req, res) => {
  try {
    const files = await File.findAll({ where: { user_id: req.params.user_id } });
    if (files.length === 0) {
      return res.status(404).json({ message: "Nenhum arquivo encontrado para este usuário." });
    }
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar um arquivo específico pelo ID
const getFileById = async (req, res) => {
  try {
    const file = await File.findOne({ where: { file_id: req.params.file_id } });
    if (file) {
      res.status(200).json(file);
    } else {
      res.status(404).json({ message: "Arquivo não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar informações de um arquivo (sem alterar o arquivo em si)
const updateFile = async (req, res) => {
  try {
    const { file_id } = req.params;
    const [updated] = await File.update(req.body, {
      where: { file_id }
    });

    if (updated) {
      const updatedFile = await File.findOne({ where: { file_id } });
      res.status(200).json(updatedFile);
    } else {
      res.status(404).json({ message: "Arquivo não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Excluir um arquivo
const deleteFile = async (req, res) => {
  try {
    const { file_id } = req.params;
    const deleted = await File.destroy({
      where: { file_id }
    });

    if (deleted) {
      res.status(204).json({ message: "Arquivo excluído com sucesso." });
    } else {
      res.status(404).json({ message: "Arquivo não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rota para realizar o upload do arquivo (usando o middleware do Multer)
const uploadFile = upload.single('file'); // 'file' é o nome do campo no formulário de upload

export default {
  createFile,
  getFilesByUserId,
  getFileById,
  updateFile,
  deleteFile,
  uploadFile,  // Rota de upload
};
