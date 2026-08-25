import { expect, test } from "@playwright/test";

test("public authentication and academy onboarding work",async({page},testInfo)=>{
  const email=`owner.${testInfo.project.name.replaceAll(/[^a-z0-9]/gi,"")}.${Date.now()}@example.test`;
  await page.goto("/register");
  await page.getByLabel("Your name").fill("Fictional Pilot Owner");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill("FictionalPass123!");
  await page.getByRole("button",{name:"Create account"}).click();
  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByLabel("Academy name").fill(`Amanah ${testInfo.project.name}`);
  await page.getByRole("button",{name:"Finish setup"}).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading",{name:/Assalamu Alaikum/})).toBeVisible();
});

test("mobile authentication UI has no horizontal overflow",async({page})=>{
  await page.goto("/login");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)).toBe(false);
  await expect(page.getByRole("button",{name:"Sign in"})).toBeVisible();
});

test("unauthenticated academy and export routes are protected",async({page})=>{
  await page.goto("/app/students");
  await expect(page).toHaveURL(/\/login/);
  const response=await page.request.get("/api/exports/lessons",{maxRedirects:0});
  expect([302,307,401,403]).toContain(response.status());
});
