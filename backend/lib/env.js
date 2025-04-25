const requiredEnvVars = [
  "PORT",
  "MONGO_URL",
  "NODE_ENV",
  "JWT_SECRET",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "REDIS_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "STRIPE_SECRET_KEY",
  "CLIENT_URL",
];
export const checkEnvVars = () => {
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (!missingEnvVars.length) return;

  console.error(
    `[Error]: Missing required environment variables: [${missingEnvVars.join(
      ", "
    )}]`
  );
  process.exit(1);
};
