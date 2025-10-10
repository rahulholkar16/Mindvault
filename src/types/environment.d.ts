declare namespace NodeJs {
    interface ProcessEnv {
        PORT: string;
        DB_URL: string;
        ACCESS_JWT_SECRET: string;
        ACCESS_TOKEN_EXPIRY: string;
        CORS_ORIGIN: string;
        REFRESH_JWT_SECRET: string;
        REFRESH_TOKEN_EXPIRY: string;
        EMAIL_USER: string;
        EMAIL_PASS: string;
        FORGOT_PASSWORD_REDIRECT_URL: string;
        CLOUD_NAME: string;
        CLOUD_API_KEY: string;
        CLOUD_API_SECRET: string;
    }
}