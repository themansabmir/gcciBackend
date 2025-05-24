

import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { Logger } from "@lib/logger";

const extractErrors = (
  error: any,
  path: string[] = [],
  errors: Record<string, string> = {}
): Record<string, string> => {
  for (const key in error) {
    const current = error[key];
    const newPath = [...path, key];

    if (current?._errors?.length) {
      errors[newPath.join(".")] = current._errors[0];
    }

    if (typeof current === "object" && !Array.isArray(current)) {
      extractErrors(current, newPath, errors);
    }

    if (Array.isArray(current)) {
      current.forEach((item, index) => {
        extractErrors(item, [...newPath, index.toString()], errors);
      });
    }
  }
  return errors;
};

export const validateDTO = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      Logger.error("ERROR:ZOD validation error", result?.error.format())
      const friendlyErrors = extractErrors(result.error.format());
      if (Object.keys(friendlyErrors).length === 0)
        throw new Error("Invalid request body");
      throw new Error(JSON.stringify(friendlyErrors));
    }

    req.body = result.data;
    next();
  };
};
