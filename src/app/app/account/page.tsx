import { AccountSecurity } from "@/components/account-security";
import { PageHeader } from "@/components/workspace-ui";
import { requireWorkspace } from "@/server/session";
export default async function Account(){const ctx=await requireWorkspace();return <><PageHeader eyebrow="Account security" title="Your account" description={`${ctx.user.name} · ${ctx.user.email}. Only you can manage these sessions.`}/><AccountSecurity/></>}
