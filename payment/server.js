import 'dotenv/config';
import app from './src/app.js';
import connectDb from './src/config/db.js'

const PORT = process.env.PORT || 4004;

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 