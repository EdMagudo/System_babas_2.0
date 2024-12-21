import { Op } from 'sequelize';
import db from "../Models/index.js";

const NannyProfiles = db.Nanny_Profiles;
const Files = db.Files;
const User = db.Users;

// Criar perfil de nanny
const createProfile = async (req, res) => {
  try {
    const profile = await NannyProfiles.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter todos os perfis de nanny
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await NannyProfiles.findAll();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNannyDetails = async (req, res) => {
  try {
    // Pegando os parâmetros passados na query string
    const { province_name, job_type } = req.query;
console.log(province_name, job_type);
    // Construir a query base
    let query = `
      SELECT 
          u.first_name, 
          u.email, 
          np.nanny_id, 
          np.education_level, 
          np.date_of_birth, 
          f.file_path
      FROM Users u
      JOIN Nanny_Profiles np ON u.user_id = np.user_id
      LEFT JOIN Files f ON u.user_id = f.user_id
      WHERE u.role = 'nanny'
    `;

    // Adicionar o filtro para province_name, se fornecido
    if (province_name) {
      query += ` AND np.province_name = :province_name`;
    }

    // Adicionar o filtro para job_type, se fornecido
    if (job_type) {
      query += ` AND np.job_type = :job_type`;
    }

    // Executar a query com os parâmetros
    const [nannies, metadata] = await db.sequelize.query(query, {
      replacements: {
        province_name: province_name,
        job_type: job_type,
      }
    });

    // Retornar os dados no formato desejado
    res.status(200).json(nannies);
  } catch (error) {
    console.error('Erro ao buscar os detalhes das nannies:', error);
    res.status(500).json({ error: error.message });
  }
};



// Obter perfil de nanny por ID
const getProfileById = async (req, res) => {
  try {
    const profile = await NannyProfiles.findByPk(req.params.nanny_id);
    if (profile) {
      res.status(200).json(profile);
    } else {
      res.status(404).json({ message: "Nanny profile not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar perfil de nanny
const updateProfile = async (req, res) => {
  try {
    const [updated] = await NannyProfiles.update(req.body, {
      where: { nanny_id: req.params.nanny_id },
    });
    if (updated) {
      const updatedProfile = await NannyProfiles.findByPk(req.params.nanny_id);
      res.status(200).json(updatedProfile);
    } else {
      res.status(404).json({ message: "Nanny profile not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar perfil de nanny
const deleteProfile = async (req, res) => {
  try {
    const deleted = await NannyProfiles.destroy({
      where: { nanny_id: req.params.nanny_id },
    });
    if (deleted) {
      res.status(204).json({ message: "Nanny profile deleted" });
    } else {
      res.status(404).json({ message: "Nanny profile not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createProfile,
  getAllProfiles,
  getNannyDetails,
  getProfileById,
  updateProfile,
  deleteProfile,
};
