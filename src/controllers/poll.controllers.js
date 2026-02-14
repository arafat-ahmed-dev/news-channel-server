import Poll from '../models/poll.models.js';

export const createPoll = async (req, res, next) => {
  try {
    const poll = new Poll(req.body);
    await poll.save();
    res.status(201).json({ success: true, data: poll });
  } catch (err) {
    next(err);
  }
};

export const getAllPolls = async (req, res, next) => {
  try {
    const polls = await Poll.find();
    res.status(200).json({ success: true, data: polls });
  } catch (err) {
    next(err);
  }
};

export const votePoll = async (req, res, next) => {
  try {
    const { pollId, userId, optionIndex } = req.body;
    const poll = await Poll.findOne({ pollId });
    if (!poll)
      return res.status(404).json({ success: false, message: 'Not found' });
    poll.votes.push({ userId, optionIndex });
    await poll.save();
    res.status(200).json({ success: true, data: poll });
  } catch (err) {
    next(err);
  }
};

export const deletePoll = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const poll = await Poll.findOneAndDelete({ pollId });
    if (!poll)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
