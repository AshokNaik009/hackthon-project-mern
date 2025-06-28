const isValidEpoch = (epoch) => {
    const date = new Date(Number(epoch));
    return !Number.isNaN(date.getTime());
};

module.exports = {
    isValidEpoch
};