import { z } from 'zod';
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        return res.status(400).json({ message: errorMessages, success: false });
      }

      return res.status(500).json({
        message: `Failed to validate schema: ${error}`,
        error: error.message,
        success: false,
      });
    }
  };
};