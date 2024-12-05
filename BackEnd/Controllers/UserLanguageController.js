import db from "../Models/index.js";
const UserLanguage = db.User_Language;

const createUserLanguage = async (req, res) => {
  try {
    const userLanguage = await UserLanguage.create(req.body);
    res.status(201).json(userLanguage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUserLanguages = async (req, res) => {
  try {
    const userLanguages = await UserLanguage.findAll();
    res.status(200).json(userLanguages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserLanguagesByUserId = async (req, res) => {
  try {
    const userLanguages = await UserLanguage.findAll({
      where: { user_id: req.params.user_id },
    });
    if (userLanguages.length > 0) {
      res.status(200).json(userLanguages);
    } else {
      res.status(404).json({ message: "No languages found for this user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserLanguage = async (req, res) => {
  try {
    const deleted = await UserLanguage.destroy({
      where: {
        user_id: req.params.user_id,
        language_id: req.params.language_id,
      },
    });
    if (deleted) {
      res.status(204).json({ message: "User language association deleted" });
    } else {
      res.status(404).json({ message: "User language association not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createUserLanguage,
  getAllUserLanguages,
  getUserLanguagesByUserId,
  deleteUserLanguage,
};
