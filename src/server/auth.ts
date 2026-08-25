import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./schema";
import { env } from "./env";
import { sendTransactionalEmail } from "./email";

const developmentSecret = "darsflow-local-development-secret-change-before-production";

export const auth = betterAuth({
  appName: "DarsFlow",
  secret: env.BETTER_AUTH_SECRET ?? developmentSecret,
  baseURL: env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL, env.BETTER_AUTH_URL].filter((value): value is string => Boolean(value)),
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    requireEmailVerification: Boolean(env.RESEND_API_KEY),
    sendResetPassword: async ({ user, url }) => { await sendTransactionalEmail({ kind:"reset", to:user.email, subject:"Reset your DarsFlow password", text:"A password reset was requested for your DarsFlow account. If this was not you, ignore this message.", actionUrl:url, idempotencyKey:`password-reset:${user.id}:${new URL(url).searchParams.get("token")}` }); },
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 30,
  },
  emailVerification: { sendOnSignUp: true, autoSignInAfterVerification: true, expiresIn: 60 * 60, sendVerificationEmail: async ({ user, url }) => { await sendTransactionalEmail({ kind:"verify", to:user.email, subject:"Verify your DarsFlow email", text:"Verify your email address to activate your academy account.", actionUrl:url, idempotencyKey:`verify:${user.id}:${new URL(url).searchParams.get("token")}` }); } },
  session: { expiresIn: 60 * 60 * 24 * 14, updateAge: 60 * 60 * 24 },
  rateLimit: { enabled: true, window: 60, max: 100, customRules: { "/sign-in/email": { window: 60, max: 5 }, "/sign-up/email": { window: 60, max: 3 }, "/request-password-reset": { window: 60, max: 3 }, "/send-verification-email": { window: 60, max: 3 } } },
  advanced: { database: { generateId: () => crypto.randomUUID() } },
});
