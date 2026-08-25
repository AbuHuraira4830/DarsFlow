import { z } from "zod";

const optionalUrl = z.string().url().optional().or(z.literal(""));
const schema = z.object({
  DATABASE_URL: z.string().min(1).default("pglite:./data/darsflow-pg"),
  DATABASE_MIGRATION_URL: z.string().min(1).optional(),
  BETTER_AUTH_SECRET: z.string().min(32).optional(),
  BETTER_AUTH_URL: optionalUrl,
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  EMAIL_FROM: z.string().email().optional(),
  NEXT_PUBLIC_APP_URL: optionalUrl,
  PLATFORM_ADMIN_EMAILS: z.string().default(""),
  PILOT_MODE: z.enum(["public", "invitation_only"]).default("public"),
});
const result = schema.safeParse(process.env);
if (!result.success) throw new Error(`Invalid DarsFlow environment configuration: ${result.error.issues.map((issue)=>issue.path.join(".")).join(", ")}`);
if (process.env.VERCEL && (!result.data.BETTER_AUTH_SECRET || !result.data.BETTER_AUTH_URL || !result.data.NEXT_PUBLIC_APP_URL || !result.data.DATABASE_URL.startsWith("postgres"))) throw new Error("Hosted deployments require PostgreSQL DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL and NEXT_PUBLIC_APP_URL.");
if (process.env.VERCEL && result.data.PILOT_MODE !== "invitation_only" && !result.data.RESEND_API_KEY) throw new Error("Hosted public registration requires a configured email provider; otherwise set PILOT_MODE=invitation_only.");
if (Boolean(result.data.RESEND_API_KEY) !== Boolean(result.data.EMAIL_FROM)) throw new Error("RESEND_API_KEY and EMAIL_FROM must be configured together.");
export const env = result.data;
