declare namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGODB_URI: string;
      NODE_ENV: "development" | "production";
      PASSWORD_SALT_ROUNDS: number;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      JWT_ACCESS_EXPIRES_IN: string;
      JWT_REFRESH_EXPIRES_IN: string;
      EMAIL_HOST: string;
      EMAIL_PORT: number;
      EMAIL_USER: string;
      EMAIL_PASS: string;
    }
  }