import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './modules/transaction.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/default', {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('Connected to MongoDB');
        });
        connection.on('error', (err) => {
          console.error('Error connecting to MongoDB:', err.message);
        });
        return connection;
      },
    }),
    AuthModule,
    TransactionModule,
  ],
})
export class AppModule {}
