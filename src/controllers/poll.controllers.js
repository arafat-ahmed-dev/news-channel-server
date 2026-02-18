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

export const getPollById = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const poll = await Poll.findOne({ pollId });
    if (!poll)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: poll });
  } catch (err) {
    next(err);
  }
};

export const updatePoll = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const { question, options, status } = req.body;

    let poll = await Poll.findById(pollId);
    if (!poll) {
      poll = await Poll.findOne({ pollId });
    }

    if (!poll) {
      return res
        .status(404)
        .json({ success: false, message: 'Poll not found' });
    }

    if (question) poll.question = question;
    if (options) poll.options = options;
    if (status) poll.status = status;

    await poll.save();
    res.status(200).json({
      success: true,
      data: poll,
      message: 'Poll updated successfully',
    });
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
    let poll = await Poll.findByIdAndDelete(pollId);

    if (!poll) {
      poll = await Poll.findOneAndDelete({ pollId });
    }

    if (!poll)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
