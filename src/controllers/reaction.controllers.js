import Reaction from '../models/reaction.models.js';

// Create a new reaction
export const createReaction = async (req, res, next) => {
  try {
    const { articleId, type, userId } = req.body;
    // Optionally: prevent duplicate reactions by the same user for the same article
    let reaction = await Reaction.findOne({ articleId, userId });
    if (reaction) {
      reaction.type = type;
      await reaction.save();
      return res.status(200).json({ success: true, data: reaction });
    }
    reaction = new Reaction({ articleId, type, userId });
    await reaction.save();
    res.status(201).json({ success: true, data: reaction });
  } catch (err) {
    next(err);
  }
};

// Get reactions for an article
export const getReactionsByArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const reactions = await Reaction.find({ articleId }).lean();
    res.status(200).json({ success: true, data: reactions });
  } catch (err) {
    next(err);
  }
};

// Delete a reaction
export const deleteReaction = async (req, res, next) => {
  try {
    const { articleId, userId } = req.body;
    const result = await Reaction.findOneAndDelete({ articleId, userId });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: 'Reaction not found' });
    }
    res.status(200).json({ success: true, message: 'Reaction deleted' });
  } catch (err) {
    next(err);
  }
};
