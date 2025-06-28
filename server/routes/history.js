const express = require('express');
const { STATUS, SIZE, TYPE } = require('../constants/constants');
const { isValidEpoch } = require('../constants/lib');
const router = express.Router();



/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get all orders history
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of order history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const { id, startDate, endDate, type, status, page, size } = req.query;

        console.log(!id && !startDate && !endDate && !type && !status);
        if (!id && !startDate && !endDate && !type && !status) {
            return res.status(400).json({
                success: false,
                message: "At least one filter needs to be selected",
            });
        }
        // Check the date
        const filter = {}


        // Check the type
        if (type) {
            if (!Object.values(TYPE).includes(type)) {
                return res.status(400).json({ message: 'Invalid Transaction Type' });
            }

            filter.type = type;
        }

        // Check the status
        if (status) {
            if (!Object.values(STATUS).includes(status)) {
                return res.status(400).json({ message: 'Invalid Order Status' });
            }

            filter.status = status;
        }

        if (startDate && endDate) {
            if (!isValidEpoch(startDate) || !isValidEpoch(endDate)) {
                //return res.status(400).json({ message: 'Invalid From Date or To Date' });
            }
        }

        // Size
        if (size && Object.values(SIZE).includes(size)) {

        }

        // Page
        if (page && Number.isNaN(Number(page)) && page > 0) {

        }

        const data = [
            {
                date: "2024-06-28",
                txnId: "TXN001",
                symbol: "AAPL",
                type: "BUY",
                quantity: 50,
                price: 150.0,
                total: 7500.0,
            },
            {
                date: "2024-06-27",
                txnId: "TXN002",
                symbol: "MSFT",
                type: "SELL",
                quantity: 25,
                price: 300.0,
                total: 7500.0,
            },
            {
                date: "2024-06-26",
                txnId: "TXN003",
                symbol: "GOOGL",
                type: "BUY",
                quantity: 10,
                price: 2800.0,
                total: 28000.0,
            },
            {
                date: "2024-06-25",
                txnId: "TXN004",
                symbol: "TSLA",
                type: "SELL",
                quantity: 5,
                price: 700.0,
                total: 3500.0,
            },
            {
                date: "2024-06-24",
                txnId: "TXN005",
                symbol: "AMZN",
                type: "BUY",
                quantity: 15,
                price: 3300.0,
                total: 49500.0,
            },
            {
                date: "2024-06-23",
                txnId: "TXN006",
                symbol: "NFLX",
                type: "SELL",
                quantity: 20,
                price: 500.0,
                total: 10000.0,
            },
        ];
        const count = data.length;

        res.status(200).json({
            success: true,
            count,
            data
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

module.exports = router;