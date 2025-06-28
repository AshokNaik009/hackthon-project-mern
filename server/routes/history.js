const express = require('express');
const { STATUS, SIZE, TYPE } = require('../constants/constants');
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
            return res.status(400).json({ message: 'Invalid From Date or To Date' });
        }
    }

    // Size
    if (size && Object.values(SIZE).includes(size)) {

    }

    // Page
    if (page && Number.isNaN(Number(page)) && page > 0) {

    }

    const count = 0;
    const data = {}
    
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