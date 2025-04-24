const requiredEnvVars = ["PORT", "MONGO_URL", "NODE_ENV", "JWT_SECRET"];
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
