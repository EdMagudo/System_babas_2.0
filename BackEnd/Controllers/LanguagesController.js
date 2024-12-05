import db from "../Models/index.js";
const Languages = db.Languages;

const createLanguage = async (req, res) => {
  try {
    const language = await Languages.create(req.body);
    res.status(201).json(language);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllLanguages = async (req, res) => {
  try {
    const languages = await Languages.findAll();
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLanguageById = async (req, res) => {
  try {
    const language = await Languages.findByPk(req.params.id);
    if (language) {
      res.status(200).json(language);
    } else {
      res.status(404).json({ message: "Language not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLanguage = async (req, res) => {
  try {
    const [updated] = await Languages.update(req.body, {
      where: { language_id: req.params.id },
    });
    if (updated) {
      const updatedLanguage = await Languages.findByPk(req.params.id);
      res.status(200).json(updatedLanguage);
    } else {
      res.status(404).json({ message: "Language not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLanguage = async (req, res) => {
  try {
    const deleted = await Languages.destroy({
      where: { language_id: req.params.id },
    });
    if (deleted) {
      res.status(204).json({ message: "Language deleted" });
    } else {
      res.status(404).json({ message: "Language not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createLanguage,
  getAllLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
};
