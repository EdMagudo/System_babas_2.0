import db from "../Models/index.js";
import multer from 'multer';

const Nanny = db.Nannies;
const Files = db.Files;

// Configure multer for file upload
const upload = multer({ dest: 'uploads/nannies/' });

const registerNanny = async (req, res) => {
  try {
    // Check for existing nanny with same contact details
    const existingNanny = await Nanny.findOne({ 
      where: { 
        contactNumber: req.body.contactNumber,
        idNumber: req.body.idNumber 
      } 
    });

    if (existingNanny) {
      return res.status(400).json({ message: 'A nanny with these details already exists.' });
    }

    // Prepare nanny data
    const nannyData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dob: req.body.dob,
      contactNumber: req.body.contactNumber,
      country: req.body.country,
      province: req.body.province,
      idNumber: req.body.idNumber,
      educationLevel: req.body.educationLevel,
      jobType: req.body.jobType,
      experience: req.body.experience,
      ageGroups: JSON.parse(req.body.ageGroups),
      policeClearance: req.body.policeClearance,
      workHours: JSON.parse(req.body.workHours),
      preferredAgeGroups: JSON.parse(req.body.preferredAgeGroups),
      languages: JSON.parse(req.body.languages),
      additionalInfo: req.body.additionalInfo
    };

    // Create nanny record
    const nanny = await Nanny.create(nannyData);

    // Handle ID copy file upload
    if (req.file) {
      const fileData = {
        nanny_id: nanny.id,
        file_name: req.file.originalname,
        file_path: req.file.path,
        file_type: req.file.mimetype,
        file_category: 'id_copy'
      };

      await Files.create(fileData);
    }

    // Handle police clearance file upload (if exists)
    const policeClearanceFile = req.files?.find(file => file.fieldname === 'policeClearanceCopy');
    if (policeClearanceFile) {
      const clearanceFileData = {
        nanny_id: nanny.id,
        file_name: policeClearanceFile.originalname,
        file_path: policeClearanceFile.path,
        file_type: policeClearanceFile.mimetype,
        file_category: 'police_clearance'
      };

      await Files.create(clearanceFileData);
    }

    res.status(201).json({
      message: 'Nanny registration successful!',
      nanny: {
        id: nanny.id,
        name: `${nanny.firstName} ${nanny.lastName}`
      }
    });

  } catch (error) {
    console.error('Nanny registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

const getNannyById = async (req, res) => {
  try {
    const nanny = await Nanny.findByPk(req.params.id, {
      include: [
        { 
          model: Files, 
          where: { nanny_id: req.params.id },
          required: false
        }
      ]
    });

    if (!nanny) {
      return res.status(404).json({ message: 'Nanny not found' });
    }

    res.status(200).json(nanny);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateNanny = async (req, res) => {
  try {
    const [updated] = await Nanny.update(req.body, {
      where: { id: req.params.id }
    });

    if (updated) {
      const updatedNanny = await Nanny.findByPk(req.params.id);
      res.status(200).json(updatedNanny);
    } else {
      res.status(404).json({ message: 'Nanny not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  registerNanny,
  getNannyById,
  updateNanny
};