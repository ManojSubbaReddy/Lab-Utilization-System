// middleware/auth.ts
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';

export interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: {
    userId: string;
    role: string;
    department: string;
    // add additional fields as needed
  };
}

export const authenticate = (handler: NextApiHandler) => async (
  req: AuthenticatedNextApiRequest,
  res: NextApiResponse
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as AuthenticatedNextApiRequest['user'];
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
