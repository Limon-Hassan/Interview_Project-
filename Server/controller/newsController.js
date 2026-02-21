const News = require("../model_schema/News");

async function GetNews(req, res) {
  try {
    const {
      page = 1,
      limit = 50,
      category,
      country,
      language,
      creator,
      startDate,
      endDate,
      search,
    } = req.query;

    const query = {};

    if (category) query.category = { $in: category.split(',') };
    if (country) query.country = { $in: country.split(',') };
    if (language) query.language = language;
    if (creator) query.creator = { $regex: creator, $options: 'i' };
    if (startDate || endDate)
      query.pubDate = {
        ...(startDate && { $gte: new Date(startDate) }),
        ...(endDate && { $lte: new Date(endDate) }),
      };
    if (search) query.title = { $regex: search, $options: 'i' };

    const news = await News.find(query)
      .sort({ pubDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await News.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      news,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  GetNews,
};
