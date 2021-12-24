import * as jwt from 'jsonwebtoken';

const jwtSign = (data: any): string => {
    const secret = process.env.JWT_SECRET;
    return jwt.sign(data, secret, { algorithm: 'HS512', expiresIn: '1h' });
};

export default jwtSign;