import ReadingHistory from '../models/readinghistory.models.js';

export const addReadingHistory = async (req, res, next) => {
  try {
    const history = new ReadingHistory(req.body);
    await history.save();
    res.status(201).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

export const getReadingHistoryByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const history = await ReadingHistory.find({ userId })
      .sort({ timestamp: -1 })
      .lean();
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

export const deleteReadingHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const history = await ReadingHistory.findByIdAndDelete(id);
    if (!history)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
