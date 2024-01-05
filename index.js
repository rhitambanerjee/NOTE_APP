const express=require('express');
const dotenv =require('dotenv');
const bodyParser=require('body-parser');
const rateLimit=require('express-rate-limit');

// Components
const Connection=require('./database/db');
const routes=require('./routes/index')

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/auth',limiter);
app.use('/api/notes',limiter)
app.set('trust proxy',1);
app.use('/', routes);

const PORT = 8000;
const password = process.env.DB_PASSWORD;
const username = process.env.DB_USERNAME;

Connection(username, password);

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));