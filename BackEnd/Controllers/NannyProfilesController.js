import db from "../Models/index.js";
const NannyProfiles = db.Nanny_Profiles;

const createProfile = async (req, res) => {
  try {
    const profile = await NannyProfiles.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await NannyProfiles.findAll();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
  getProfileById,
  updateProfile,
  deleteProfile,
};
