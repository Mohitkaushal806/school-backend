import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectRequest } from '../schemas/collectRequest.schema';
import { CollectRequestStatus } from '../schemas/collectRequestStatus.schema';

@Injectable()
export class TransactionService {
    constructor(
        @InjectModel(CollectRequest.name) private readonly collectRequestModel: Model<CollectRequest>,
        @InjectModel(CollectRequestStatus.name)
        private readonly collectRequestStatusModel: Model<CollectRequestStatus>,
    ) { }

    async getAllCollectRequests() {
        return this.collectRequestModel.aggregate([
            {
                $addFields: {
                    string_id: { $toString: '$_id' }, // Convert `_id` (ObjectId) to a string
                },
            },
            {
                $lookup: {
                    from: 'collect_request_status', // The name of the status collection
                    localField: 'string_id',
                    foreignField: 'collect_id',
                    as: 'statusData',
                },
            },
            {
                $unwind: {
                    path: '$statusData',
                    preserveNullAndEmptyArrays: true, // Ensure no error if there's no matching status
                },
            },
            {
                $project: {
                    collect_id: '$_id',
                    school_id: 1,
                    gateway: 1,
                    order_amount: 1,
                    transaction_amount: '$statusData.transaction_amount',
                    status: '$statusData.status',
                    custom_order_id: 1,
                },
            }
        ]).exec();;
    }

    async getCollectRequestsBySchool(schoolId: string) {
        return this.collectRequestModel.aggregate([
            {
                $match: {
                  school_id: schoolId, // Filter by the specific school_id
                },
              },
            {
                $addFields: {
                    string_id: { $toString: '$_id' }, // Convert `_id` (ObjectId) to a string
                },
            },
            {
                $lookup: {
                    from: 'collect_request_status', // The name of the status collection
                    localField: 'string_id',
                    foreignField: 'collect_id',
                    as: 'statusData',
                },
            },
            {
                $unwind: {
                    path: '$statusData',
                    preserveNullAndEmptyArrays: true, // Ensure no error if there's no matching status
                },
            },
            {
                $project: {
                    collect_id: '$_id',
                    school_id: 1,
                    gateway: 1,
                    order_amount: 1,
                    transaction_amount: '$statusData.transaction_amount',
                    status: '$statusData.status',
                    custom_order_id: 1,
                },
            }
        ]).exec();    
    }

    async getCollectRequestStatus(customOrderId: string) {
        return this.collectRequestModel.aggregate([
            {
                $match: {
                    custom_order_id: customOrderId, // Filter by the specific school_id
                },
              },
            {
                $addFields: {
                    string_id: { $toString: '$_id' }, // Convert `_id` (ObjectId) to a string
                },
            },
            {
                $lookup: {
                    from: 'collect_request_status', // The name of the status collection
                    localField: 'string_id',
                    foreignField: 'collect_id',
                    as: 'statusData',
                },
            },
            {
                $unwind: {
                    path: '$statusData',
                    preserveNullAndEmptyArrays: true, // Ensure no error if there's no matching status
                },
            },
            {
                $project: {
                    collect_id: '$_id',
                    school_id: 1,
                    gateway: 1,
                    order_amount: 1,
                    transaction_amount: '$statusData.transaction_amount',
                    status: '$statusData.status',
                    custom_order_id: 1,
                },
            }
        ]).exec();
    }

    async updateTransactionStatus(payload: any) {
        const { status, order_info } = payload;
        const { order_id, transaction_amount, gateway, bank_reference } = order_info;
      
        // Extract collect_id from order_id
        const collectId = order_id.split('/')[0];
      
        // Update or create the transaction status
        return this.collectRequestStatusModel.updateOne(
          { collect_id: collectId }, // Match the collect_id
          {
            collect_id: collectId,
            status: status === 200 ? 'SUCCESS' : 'FAILED', // Map status codes to status strings
            transaction_amount,
            gateway,
            bank_reference,
          },
          { upsert: true }, // Insert a new document if it doesn't exist
        );
      }
      

      async manualUpdateTransactionStatus(collectId: string, status: string) {
        // Update the transaction status for the provided collect_id
        const result = await this.collectRequestStatusModel.updateOne(
          { collect_id: collectId },
          { status },
          { upsert: false }, // Do not insert a new document if it doesn't exist
        );
      
        if (result.modifiedCount === 0) {
          throw new Error('Transaction not found or status unchanged');
        }
      
        return {
          message: 'Transaction status updated successfully',
          collect_id: collectId,
          new_status: status,
        };
      }
      
}
