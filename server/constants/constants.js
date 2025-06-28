const TYPE = Object.freeze({
    BUY: "Buy",
    SELL: "Sell"
});

const STATUS = Object.freeze({
    SUBMITTED: 'Submitted',
    CANCELLED: 'Cancelled',
    EXECUTED: 'Executed',
    COMPLETED: 'Completed',
    FAILED: 'Failed'
})

const SIZE = Object.freeze({
    SIZE_10: 10,
    SIZE_20: 20,
    SIZE_50: 50
})

module.exports = {
    TYPE,
    STATUS,
    SIZE
};
