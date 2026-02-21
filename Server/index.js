let express = require('express');
let dotenv = require('dotenv');
dotenv.config();
let cors = require('cors');
let bodyParser = require('body-parser');
const DBConfig = require('./helper/dbConfig');
const { default: axios } = require('axios');
const router = require('./routes/news');
let userRouter = require('./routes/user');
const cron = require('node-cron');
const { fetchAndSaveNews } = require('./controller/ApiConnectation');
let app = express();

DBConfig();
app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);
app.use('/user', userRouter);

cron.schedule('*/10 * * * *', async () => {
  console.log('Running scheduled fetch...');
  try {
    await fetchAndSaveNews({}, { send: () => {} });
  } catch (err) {
    console.error('Cron job error:', err.message);
  }
});

app.get('/test-api', async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${process.env.API_KEY}&country=us`,
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.SERVER_PORT || 4545, () => {
  console.log('Server is running on port ' + process.env.SERVER_PORT);
});
