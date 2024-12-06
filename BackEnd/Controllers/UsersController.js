import db from "../Models/index.js";
const User = db.Users;
const Files = db.Files;
const Nanny_Profiles = db.Nanny_Profiles;


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





/*
const createNannyUser = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
      // Verifica se o email ou ID já existe
      const existingUser = await User.findOne({ 
          where: { email: req.body.email },
          transaction 
      });

      const existingIdNumber = req.body.id_number
          ? await User.findOne({ 
              where: { id_number: req.body.id_number },
              transaction 
          })
          : null;

      if (existingUser) {
          await transaction.rollback();
          return res.status(400).json({ message: 'O email já está em uso.' });
      }

      if (existingIdNumber) {
          await transaction.rollback();
          return res.status(400).json({ message: 'O ID já está em uso.' });
      }

      // Adicionar role de nanny
      const userData = {
          ...req.body,
          role: 'nanny' // Garante que o usuário seja criado com role de nanny
      };
      delete userData.file;

      // Criar usuário
      const user = await User.create(userData, { transaction });

      // Criar perfil de nanny
      const nannyProfileData = {
          user_id: user.user_id,
          education_level: req.body.education_level,
          job_type: req.body.job_type,
          experience_years: req.body.experience_years,
          has_criminal_record: req.body.has_criminal_record,
          special_needs_experience: req.body.special_needs_experience,
          additional_info: req.body.additional_info
      };

      const nannyProfile = await Nanny_Profiles.create(nannyProfileData, { transaction });

      // Salvar arquivo se existir
      if (req.file) {
          const fileData = {
              user_id: user.user_id,
              file_name: req.file.originalname,
              file_path: req.file.path,
              file_type: req.file.mimetype
          };

          await Files.create(fileData, { transaction });
      }

      // Commit da transação
      await transaction.commit();

      res.status(201).json({
          message: 'Usuário Nanny criado com sucesso!',
          user,
          nannyProfile
      });

  } catch (error) {
      // Rollback da transação em caso de erro
      await transaction.rollback();
      res.status(500).json({ error: error.message });
  }
};*/
/*
const createNannyUser = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
      // Verifica se o email ou ID já existe
      const existingUser = await User.findOne({ 
          where: { email: req.body.email },
          transaction 
      });

      const existingIdNumber = req.body.id_number
          ? await User.findOne({ 
              where: { id_number: req.body.id_number },
              transaction 
          })
          : null;

      if (existingUser) {
          await transaction.rollback();
          return res.status(400).json({ message: 'O email já está em uso.' });
      }

      if (existingIdNumber) {
          await transaction.rollback();
          return res.status(400).json({ message: 'O ID já está em uso.' });
      }

      // Preparar dados do usuário
      const userData = {
          ...req.body,
          role: 'nanny' // Garante que o usuário seja criado com role de nanny
      };
      
      // Remover arquivos dos dados do usuário
      const files = req.body.files || {};
      delete userData.files;

      // Criar usuário
      const user = await User.create(userData, { transaction });

      // Criar perfil de nanny
      const nannyProfileData = {
          user_id: user.user_id,
          education_level: req.body.education_level,
          job_type: req.body.job_type,
          experience_years: req.body.experience_years,
          has_criminal_record: req.body.has_criminal_record,
          special_needs_experience: req.body.special_needs_experience,
          additional_info: req.body.additional_info,
          
          // Campos adicionais do NannyCard
          rating: req.body.rating || 0,
          location: req.body.location,
          available_from: req.body.availableFrom,
          available_to: req.body.availableTo,
          hourly_rate: req.body.hourlyRate,
          languages: JSON.stringify(req.body.languages || []),
          specialties: JSON.stringify(req.body.specialties || [])
      };

      const nannyProfile = await Nanny_Profiles.create(nannyProfileData, { transaction });

      // Salvar múltiplos arquivos
      const filePromises = Object.entries(files).map(async ([fileType, fileData]) => {
          if (fileData) {
              const completeFileData = {
                  user_id: user.user_id,
                  file_name: fileData.name,
                  file_path: `/uploads/nanny/${user.user_id}_${fileType}_${fileData.name}`,
                  file_type: fileData.type,
                  file_category: fileType // Categoria do arquivo (photo, document, etc.)
              };

              return Files.create(completeFileData, { transaction });
          }
      });

      // Aguardar todos os uploads de arquivo
      await Promise.all(filePromises.filter(Boolean));

      // Commit da transação
      await transaction.commit();

      res.status(201).json({
          message: 'Usuário Nanny criado com sucesso!',
          user,
          nannyProfile
      });

  } catch (error) {
      // Rollback da transação em caso de erro
      await transaction.rollback();
      res.status(500).json({ error: error.message });
  }
};*/

const createNannyUser = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
      // Verifica se o email ou ID já existe
      const existingUser = await User.findOne({ 
          where: { email: req.body.email },
          transaction 
      });

      const existingIdNumber = req.body.id_number
          ? await User.findOne({ 
              where: { id_number: req.body.id_number },
              transaction 
          })
          : null;

      if (existingUser) {
          await transaction.rollback();
          return res.status(400).json({ message: 'O email já está em uso.' });
      }

      if (existingIdNumber) {
          await transaction.rollback();
          return res.status(400).json({ message: 'O ID já está em uso.' });
      }

      // Preparar dados do usuário
      const userData = {
          ...req.body,
          role: 'nanny' // Garante que o usuário seja criado com role de nanny
      };
      
      // Remover arquivos dos dados do usuário
      const files = req.body.files || {};
      delete userData.files;

      // Criar usuário
      const user = await User.create(userData, { transaction });

      // Criar perfil de nanny
      const nannyProfileData = {
          user_id: user.user_id,
          education_level: req.body.education_level,
          job_type: req.body.job_type,
          experience_years: req.body.experience_years,
          has_criminal_record: req.body.has_criminal_record,
          special_needs_experience: req.body.special_needs_experience,
          additional_info: req.body.additional_info,
          
          // Campos adicionais do NannyCard
          rating: req.body.rating || 0,
          location: req.body.location,
          available_from: req.body.availableFrom,
          available_to: req.body.availableTo,
          hourly_rate: req.body.hourlyRate,
          languages: JSON.stringify(req.body.languages || []),
          specialties: JSON.stringify(req.body.specialties || [])
      };

      const nannyProfile = await Nanny_Profiles.create(nannyProfileData, { transaction });

      // Salvar múltiplos arquivos
      const filePromises = Object.entries(files).map(async ([fileType, fileData]) => {
          if (fileData) {
              const completeFileData = {
                  user_id: user.user_id,
                  file_name: fileData.name,
                  file_path: `/uploads/nanny/${user.user_id}_${fileType}_${fileData.name}`,
                  file_type: fileData.type,
                  file_category: fileType // Categoria do arquivo (photo, document, etc.)
              };

              return Files.create(completeFileData, { transaction });
          }
      });

      // Aguardar todos os uploads de arquivo
      await Promise.all(filePromises.filter(Boolean));

      // Commit da transação
      await transaction.commit();

      res.status(201).json({
          message: 'Usuário Nanny criado com sucesso!',
          user,
          nannyProfile
      });

  } catch (error) {
      // Rollback da transação em caso de erro
      await transaction.rollback();
      res.status(500).json({ error: error.message });
  }
};
export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createNannyUser,  // Adicionado para criação de usuário nanny
};
