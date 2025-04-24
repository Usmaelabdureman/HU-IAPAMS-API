import { ZodError } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = err.issues.map((issue) => ({
    path: issue.path[issue.path.length - 1],
    message: issue.message,
  }));

  let message = "Validation Error";

  if (errorSources?.length) {
    message = errorSources.map((item) => item.message).join(" | ")
  }

  const statusCode = 400;

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleZodError;