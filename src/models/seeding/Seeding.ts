import labelSeeding from './label/labelSeeding';
import recurrentTaskSeeding from './recurrent-task/recurrentTaskSeeding';
import mongoose from 'mongoose';
import logSeeding from './log/logSeeding';

const connectToMongoDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/rtms';

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log('MongoDB connected.');
  } catch (err) {
    console.error('Could not connect to MongoDB.', err);
  }
};

connectToMongoDB().then(async () => {
  await logSeeding();
  await labelSeeding();
  await recurrentTaskSeeding();

  console.log('Seeding completed!');
}).finally(() => process.exit());
