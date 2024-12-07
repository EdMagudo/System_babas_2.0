import db from "../Models/index.js";
const User = db.Users;
const Files = db.Files;
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Define o diretório de destino para o arquivo

const createUser = async (req, res) => {
  try {
     // Verifica se o email ou ID já existe
     const existingUser = await User.findOne({ where: { email: req.body.email } });
     const existingIdNumber = req.body.id_number
        ? await User.findOne({ where: { id_number: req.body.id_number } })
        : null;

     if (existingUser) {
        return res.status(400).json({ message: 'O email já está em uso.' });
     }

     if (existingIdNumber) {
        return res.status(400).json({ message: 'O ID já está em uso.' });
     }

     // Criação do usuário
     const userData = { ...req.body };
     delete userData.file; // Remover o objeto file antes de criar o usuário

     const user = await User.create(userData);

     // Salvar o arquivo na tabela Files se existir
     if (req.file) {
        const fileData = {
           user_id: user.user_id,
           file_name: req.file.originalname, // Nome original do arquivo
           file_path: req.file.path, // Caminho do arquivo salvo
           file_type: req.file.mimetype // Tipo MIME do arquivo
        };

        await Files.create(fileData);
     }

     res.status(201).json({
        message: 'Usuário criado com sucesso!',
        user,
     });

  } catch (error) {
     res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.user_id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { user_id: req.params.user_id },
    });
    if (updated) {
      const updatedUser = await User.findByPk(req.params.user_id);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { user_id: req.params.user_id },
    });
    if (deleted) {
      res.status(204).json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Obtém o email da URL
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail
};
