import db from "../Models/index.js";
const Reviews = db.Reviews;

const createReview = async (req, res) => {
  try {
    const review = await Reviews.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.findAll();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Reviews.findByPk(req.params.review_id);
    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Reviews.findAll({
      where: { reviewee_id: req.params.user_id },
    });
    if (reviews.length > 0) {
      res.status(200).json(reviews);
    } else {
      res.status(404).json({ message: "No reviews found for this user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const [updated] = await Reviews.update(req.body, {
      where: { review_id: req.params.review_id },
    });
    if (updated) {
      const updatedReview = await Reviews.findByPk(req.params.review_id);
      res.status(200).json(updatedReview);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const deleted = await Reviews.destroy({
      where: { review_id: req.params.review_id },
    });
    if (deleted) {
      res.status(204).json({ message: "Review deleted" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByUser,
  updateReview,
  deleteReview,
};
