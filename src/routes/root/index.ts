import { Router, Request, Response } from 'express';

const router = Router();

router.get('*', (req: Request, res: Response) => {
  return res.status(404).json('404 Not Found');
});

export default router;
