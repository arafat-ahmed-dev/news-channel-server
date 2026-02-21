import Notification from '../models/notification.models.js';

export const createNotification = async (req, res, next) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

export const getNotificationsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId })
      .sort({ timestamp: -1 })
      .lean();
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true },
    );
    if (!notification)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
