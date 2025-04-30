import cors from "cors";
import express, { Application } from "express";
import httpStatus from "http-status";
import swaggerUi from "swagger-ui-express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundHandler from "./app/middlewares/notFoundHandler";

import router from "./app/routes";
import swaggerSpec from "./swagger";


const app: Application = express();

// middlewares configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      'http://localhost:5173', 
      'http://localhost:5002',
      'https://hu-iapms.vercel.app',
    ],
    credentials: true,
    exposedHeaders: ['Authorization']
  })
);


// test server
app.get("/", (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "HU-IAPAMS  server is working fine",
  });
});

// api routes
app.use("/api/v1", router);

// api documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// handle error
app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;