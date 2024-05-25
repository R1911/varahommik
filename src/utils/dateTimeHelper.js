const getDateTime = () => new Date().toLocaleString().replace(",", "");

module.exports = { getDateTime };
