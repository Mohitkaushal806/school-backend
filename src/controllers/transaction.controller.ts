import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService, private readonly jwtService: JwtService, private readonly httpService: HttpService) { }

    @UseGuards(JwtAuthGuard) // Protect this endpoint
    @Get()
    @ApiOperation({ summary: 'Fetch all transactions with status and details' })
    async getAllCollectRequests() {
        return this.transactionService.getAllCollectRequests();
    }

    @UseGuards(JwtAuthGuard) // Protect this endpoint
    @Get('/school/:school_id')
    async getCollectRequestsBySchool(@Param('school_id') schoolId: string) {
        return this.transactionService.getCollectRequestsBySchool(schoolId);
    }

    @UseGuards(JwtAuthGuard) // Protect this endpoint
    @Get('/status/:custom_order_id')
    async getCollectRequestStatus(@Param('custom_order_id') customOrderId: string) {
        return this.transactionService.getCollectRequestStatus(customOrderId);
    }

    @UseGuards(JwtAuthGuard) // Protect this endpoint
    @Post('/create-collect-request')
    async createCollectRequest() {
        const data = {
            "school_id": "65b0e6293e9f76a9694d84b4",
            "amount": 100,
            "callback_url": "https://google.com"
        }
        data["sign"] = this.jwtService.sign(data, { secret: "edvtest01" })

        const url = 'https://dev-vanilla.edviron.com/erp/create-collect-request';

        try {
            // Make the API call using POST
            const response = await firstValueFrom(
                this.httpService.post(url, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw', // Add Authorization if needed
                    },
                }),
            );

            // Return the response data
            return response.data;
        } catch (error) {
            // Handle errors
            console.error('Error calling external API:', error.response?.data || error.message);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard) // Protect this endpoint
    @Post('/webhook/status-update')
    @ApiOperation({ summary: 'Webhook to update transaction status' })
    @ApiBody({
        description: 'Webhook payload containing transaction update information',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'number' },
                order_info: {
                    type: 'object',
                    properties: {
                        order_id: { type: 'string' },
                        order_amount: { type: 'number' },
                        transaction_amount: { type: 'number' },
                        gateway: { type: 'string' },
                        bank_reference: { type: 'string' },
                    },
                },
            },
        },
    })
    async updateCollectRequestStatus(@Body() payload: any) {
        return this.transactionService.updateTransactionStatus(payload);
    }

    @UseGuards(JwtAuthGuard) // Protect this endpoint
    @Post('/update-status')
    @ApiOperation({ summary: 'Manually update the status of a transaction' })
    @ApiBody({
        description: 'Payload to update transaction status manually',
        schema: {
            type: 'object',
            properties: {
                collect_id: { type: 'string', description: 'The ID of the collect request' },
                status: { type: 'string', description: 'The new status for the transaction (e.g., SUCCESS, FAILED)' },
            },
        },
    })
    async manualUpdateTransactionStatus(@Body() { collect_id, status }: { collect_id: string; status: string }) {
        return this.transactionService.manualUpdateTransactionStatus(collect_id, status);
    }
}
