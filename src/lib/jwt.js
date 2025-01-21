import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gKf^7vRg*1ZpS0hL@hRz56lQ2tG3uS23';

export const createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
