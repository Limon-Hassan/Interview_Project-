const { default: axios } = require("axios");
const News = require("../model_schema/News");

const fetchAndSaveNews = async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${process.env.API_KEY}&country=us`,
    );

    const articles = response.data.results;

    for (let article of articles) {
      await News.updateOne(
        { article_id: article.article_id },
        article,
        { upsert: true }, 
      );
    }

    console.log('News saved successfully');
    res.json({ message: 'News saved successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { fetchAndSaveNews };
