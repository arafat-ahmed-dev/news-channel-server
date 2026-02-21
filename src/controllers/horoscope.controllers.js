import HoroscopeSign from '../models/horoscope.models.js';

export const createHoroscopeSign = async (req, res, next) => {
  try {
    const sign = new HoroscopeSign(req.body);
    await sign.save();
    res.status(201).json({ success: true, data: sign });
  } catch (err) {
    next(err);
  }
};

export const getAllHoroscopeSigns = async (req, res, next) => {
  try {
    const signs = await HoroscopeSign.find().lean();
    res.status(200).json({ success: true, data: signs });
  } catch (err) {
    next(err);
  }
};

export const getHoroscopeSignBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const sign = await HoroscopeSign.findOne({ slug }).lean();
    if (!sign)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: sign });
  } catch (err) {
    next(err);
  }
};

export const updateHoroscopeSign = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const sign = await HoroscopeSign.findOneAndUpdate({ slug }, req.body, {
      new: true,
    });
    if (!sign)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: sign });
  } catch (err) {
    next(err);
  }
};

export const deleteHoroscopeSign = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const sign = await HoroscopeSign.findOneAndDelete({ slug });
    if (!sign)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
