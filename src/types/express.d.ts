declare global {
  namespace Express {
    interface Request {
      data: {
        sessionId: string;
        who: string;
        userId: string;
      };
    }
  }
}
export {};
