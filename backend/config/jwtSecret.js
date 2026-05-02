const getJwtSecret = () => process.env.secret || process.env.JWT_SECRET || process.env.jsonwebtoken;

module.exports = { getJwtSecret };
