import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from '../services/transaction.service';
import { TransactionController } from '../controllers/transaction.controller';
import { CollectRequest, CollectRequestSchema } from '../schemas/collectRequest.schema';
import { CollectRequestStatus, CollectRequestStatusSchema } from '../schemas/collectRequestStatus.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    HttpModule.register({
      timeout: 5000, // Optional: request timeout in milliseconds
      maxRedirects: 5, // Optional: maximum number of redirects
    }),
    MongooseModule.forFeature([
      { name: CollectRequest.name, schema: CollectRequestSchema, collection: 'collect_request' },
      { name: CollectRequestStatus.name, schema: CollectRequestStatusSchema, collection: "collect_request_status" },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule { }
