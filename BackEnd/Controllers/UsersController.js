import db from "../Models/index.js";
const User = db.Users;
const Files = db.Files;
const NannyProfiles = db.Nanny_Profiles;
import bcrypt from 'bcrypt';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';



const upload = multer({ dest: 'uploads/' }); // Define o diretório de destino para o arquivo


// const loginUser = async (req, res) => {
//   const { email, id_number } = req.body;

//   try {
//     const user = await User.findOne({ where: { email, id_number } });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRATION }
//     );

//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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

const createNannyUser = async (req, res) => {

  console.log("Dados: ", req.body);

    try {
      // Verifica se o email ou ID já existe
      const existingUser = await User.findOne({ where: { email: req.body.email } });
      const existingIdNumber = req.body.idNumber
        ? await User.findOne({ where: { id_number: req.body.idNumber } })
        : null;
  
      if (existingUser) {
        return res.status(400).json({ message: 'O email já está em uso.' });
      }
  
      if (existingIdNumber) {
        return res.status(400).json({ message: 'O ID já está em uso.' });
      }
      const rolee = "nanny";

      const hashedPassword = await bcrypt.hash(req.body.idNumber, 10);
      // Criação do usuário
      const userData = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        country_name: req.body.country,
        province_name: req.body.province,
        id_number: req.body.idNumber,
        password_hash: hashedPassword,
        role: rolee
      };
  
      const user = await User.create(userData);
  
      // Salvar o arquivo na tabela Files se existir
      if (req.file) {
        const fileData = {
          user_id: user.user_id,
          file_name: req.file.originalname, // Nome original do arquivo
          file_path: req.file.path, // Caminho do arquivo salvo
          file_type: req.file.mimetype, // Tipo MIME do arquivo
        };
  
        await Files.create(fileData);
      }
  
      // Criar o perfil de nanny associado ao usuário
      const nannyProfileData = {
        user_id: user.user_id,
        education_level: req.body.education_level,
        date_of_birth: req.body.date_of_birth,
        
      };
  
      await NannyProfiles.create(nannyProfileData);
  
      res.status(201).json({
        message: 'Usuário e perfil de nanny criados com sucesso!',
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      // Verifique se a senha fornecida corresponde ao password_hash armazenado
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha incorreta' });
      }
      dotenv.config(); 
      // Gerar um token JWT para o usuário
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );
  
      res.status(200).json({
        message: 'Login bem-sucedido',
        token,
        user: {
          id: user.user_id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const updatedProfile = async (req, res) => {
    console.log(req.params.id_user)
    console.log(req.body)
    console.log(req.file)
    try {
      if (req.file) {
        const fileData = {
          user_id: req.params.id_user,
          file_name: req.file.originalname,
          file_path: req.file.path,
          file_type: req.file.mimetype,
        };
    
        await Files.create(fileData);
      }
  
      const updatedProfileData = {
        jobType: req.body.jobType,
        experience: req.body.experience,
      };
  
      const updated = await NannyProfiles.update(updatedProfileData, {
        where: { nanny_id: req.params.id_user },
      });
  
      if (updated[0] === 0) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }
  
      if (req.body.languages) {
        const languages = JSON.parse(req.body.languages);
        for (const language of languages) {
          await UserLanguage.create({
             user_id: req.params.id_user,
              language 
            });
        }
      }
  
      if (req.body.work_preference) {
        const workPreferences = JSON.parse(req.body.work_preference);
        for (const workPreference of workPreferences) {
          await NannyChildWorkPreference.create({
            work_preference: workPreference,
            id_nanny: req.params.id_user
          });
        }
      }
  
      if (req.body.preference_age) {
        const agePreferences = JSON.parse(req.body.preference_age);
        for (const age of agePreferences) {
          await NannyChildAgeExperience.create({
            nanny_id: req.params.id_user,
            preference_age: age,
          });
        }
      }
  
      res.status(200).json({ message: "Perfil e dados relacionados atualizados com sucesso" });
  
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  
  
  
  
export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createNannyUser, 
  loginUser,
  updatedProfile
};
