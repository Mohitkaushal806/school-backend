import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './modules/transaction.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://test-user:edviron@edvironassessment.ub8p5.mongodb.net/test?retryWrites=true&w=majority&appName=edvironAssessment', {
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
export class AppModule { }
