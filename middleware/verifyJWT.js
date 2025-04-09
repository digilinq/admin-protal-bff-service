const jwt = require('jsonwebtoken');
require('dotenv').config();

const isValidBearerToken = (token) => {
    if (!token) return false;
    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2) return false;
    if (tokenParts[0] !== 'Bearer') return false;
    return true;
}

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!isValidBearerToken(authHeader)) return res.sendStatus(401);
    console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.username;
            next();
        }
    );
}

module.exports = verifyJWT