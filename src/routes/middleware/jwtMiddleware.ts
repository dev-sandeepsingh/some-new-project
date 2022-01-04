import { Request } from 'express';
import { beginSegment } from '../../service/newrelic';

const getToken = (req: Request) => {
  const endSegment = beginSegment('jwtMiddleware');

  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    endSegment();
    return req.headers.authorization.split(' ')[1];
  }

  endSegment();
  return null;
};

export default getToken;
