import jwt from 'jsonwebtoken';

class JwtService {
  sign(payload: object, expiresIn: string = '1h', secret = process.env.JWT_SECRET || 'secret') {
    return jwt.sign(payload, secret, { expiresIn });
  }

  verify(token: string, secret = process.env.JWT_SECRET || 'secret') {
    return jwt.verify(token, secret);
  }
}

export default new JwtService();
