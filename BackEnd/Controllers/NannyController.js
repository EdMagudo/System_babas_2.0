import db from "../Models/index.js";
import multer from "multer";
import bcrypt from "bcrypt";

const { User, NannyProfile, File, Language } = db;
const upload = multer({ dest: "uploads" }); // Configuração do Multer para upload de arquivos

// Função para registrar uma babá (nanny)
const registerNanny = async (req, res) => {
  try {
    // Imprime todos os dados recebidos na requisição
    console.log("Received data:", req.body);
    console.log("Received files:", req.files); // Se houver arquivos, imprime também

    // Validação inicial de campos obrigatórios
    const requiredFields = [
      "email",
      "firstName",
      "lastName",
      "contactNumber",
      "idNumber",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ message: `Missing required field: ${field}` });
      }
    }

    console.log(req.body.email)
    // Verifica se já existe um usuário com o mesmo email
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email or ID number" });
    }

    // Criptografa a senha antes de criar o usuário
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Criação do usuário
    const user = await User.create({
      email: req.body.email,
      role: "nanny",
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      contact_phone: req.body.contactNumber,
      email: req.body.idNumber,
      id_copy_file_path: req.file?.path || null,
      country_name: req.body.country || null,
      province_name: req.body.province || null,
      created_at: new Date(),
      last_login: new Date(),
    });

    // Criação do perfil de babá
    const nannyProfile = await NannyProfile.create({
      user_id: user.user_id,
      education_level: req.body.educationLevel || null,
      job_type: req.body.jobType || null,
      experience_years: req.body.experience || 0,
      has_criminal_record: !req.body.policeClearance,
      special_needs_experience: req.body.ageGroups?.includes("special_needs"),
      background_check_status: "pending",
      additional_info: req.body.additionalInfo || null,
    });

    // Manipula uploads de arquivos
    const files = req.files || [];
    for (const file of files) {
      await File.create({
        user_id: user.user_id,
        file_name: file.originalname,
        file_path: file.path,
        file_type: file.mimetype,
        upload_date: new Date(),
      });
    }

    // Processa os idiomas informados
    if (req.body.languages) {
      const languages =
        typeof req.body.languages === "string"
          ? JSON.parse(req.body.languages)
          : req.body.languages;

      if (Array.isArray(languages) && languages.length > 0) {
        await Promise.all(
          languages.map((language) =>
            Language.create({
              user_id: user.user_id,
              language: language.trim(),
            })
          )
        );
      }
    }

    // Resposta de sucesso
    res.status(201).json({
      message: "Registration successful",
      userId: user.user_id,
      nannyProfileId: nannyProfile.nanny_id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};


// Função para obter todas as babás (nannies)
const getAllNannies = async (req, res) => {
  try {
    const nannies = await User.findAll({
      where: { role: "nanny" },
      include: [
        {
          model: NannyProfile,
          as: "nannyProfile",
        },
      ],
    });

    if (!nannies.length) {
      return res.status(404).json({ message: "No nannies found" });
    }

    res.status(200).json(nannies);
  } catch (error) {
    console.error("Error fetching nannies:", error);
    res.status(500).json({ error: error.message });
  }
};

// Função para obter uma babá (nanny) pelo ID
const getNannyById = async (req, res) => {
  try {
    const nanny = await User.findOne({
      where: { user_id: req.params.id, role: "nanny" },
      include: [
        {
          model: NannyProfile,
          as: "nannyProfile",
        },
      ],
    });

    if (!nanny) {
      return res.status(404).json({ message: "Nanny not found" });
    }

    res.status(200).json(nanny);
  } catch (error) {
    console.error("Error fetching nanny by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  registerNanny,
  getAllNannies,
  getNannyById,
};
