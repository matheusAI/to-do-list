import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error('❌ MONGO_URI não está definido no arquivo de ambiente.');
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado ao MongoDB!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
