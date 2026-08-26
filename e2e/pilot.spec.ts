import { expect, test } from "@playwright/test";

test("public authentication and academy onboarding work",async({page},testInfo)=>{
  const email=`owner.${testInfo.project.name.replaceAll(/[^a-z0-9]/gi,"")}.${Date.now()}@example.test`;
  await page.goto("/register");
  await page.getByLabel("Your name").fill("Fictional Pilot Owner");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password",{exact:true}).fill("FictionalPass123!");
  await expect(page.getByLabel("Password",{exact:true})).toHaveAttribute("type","password");
  await page.getByRole("button",{name:"Show password"}).click();
  await expect(page.getByLabel("Password",{exact:true})).toHaveAttribute("type","text");
  await page.getByRole("button",{name:"Hide password"}).click();
  await page.getByRole("button",{name:"Create account"}).click();
  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByLabel("Academy name").fill(`Amanah ${testInfo.project.name}`);
  await page.getByRole("button",{name:"Finish setup"}).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading",{name:/Assalamu Alaikum/})).toBeVisible();
  if(testInfo.project.name==="desktop") await expect(page.getByRole("link",{name:"Home",exact:true})).toHaveAttribute("aria-current","page");
  await page.goto("/app/students");
  await page.getByLabel("Student display name").fill("Maryam T.");
  await page.getByLabel("Learning track").fill("Qaida");
  await page.getByLabel("Guardian name").fill("Fictional Guardian");
  await page.getByLabel("Relationship").fill("Parent");
  await page.getByRole("textbox",{name:"Email",exact:true}).fill(`guardian.${Date.now()}@example.test`);
  await page.getByRole("button",{name:"Add student"}).click();
  await expect(page.getByText("Maryam T.")).toBeVisible();
  await page.goto("/app/classes");
  await page.getByLabel("Class name").fill("Qaida Group");
  await page.getByLabel("Learning track").fill("Qaida");
  await page.getByLabel("Monday").check();
  await page.getByLabel("Typical time").fill("17:00");
  await page.getByRole("button",{name:"Create class"}).click();
  await expect(page.getByRole("paragraph").filter({hasText:"Qaida Group"})).toBeVisible();
});

test("mobile authentication UI has no horizontal overflow",async({page})=>{
  await page.goto("/login");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)).toBe(false);
  await expect(page.getByRole("button",{name:"Sign in"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Show password"})).toBeVisible();
});

test("public custom select supports keyboard selection",async({page})=>{
  await page.goto("/");
  const teacher=page.locator("#teacherId");
  await teacher.focus();await teacher.press("ArrowDown");await teacher.press("Enter");
  await expect(teacher).not.toContainText("Choose teacher");
});

test("public visitor can explore conversion pages and submit an access request",async({page},testInfo)=>{
  await page.goto("/");
  await expect(page.getByRole("heading",{name:/Finish every class/})).toBeVisible();
  await page.getByRole("button",{name:"Load approved sample"}).click();
  await expect(page.getByText("Assalamu alaikum",{exact:false}).first()).toBeVisible();
  await page.goto("/pricing");
  await expect(page.getByRole("heading",{name:/Capacity that grows/})).toBeVisible();
  await expect(page.getByText("Contact us for pricing").first()).toBeVisible();
  await page.goto("/request-access");
  await page.getByLabel("Academy name").fill(`Fictional Prospect ${testInfo.project.name}`);
  await page.getByLabel("Contact person").fill("Fictional Applicant");
  await page.getByLabel("Email address").fill(`prospect.${testInfo.project.name}.${Date.now()}@example.test`);
  await page.getByLabel("WhatsApp number").fill("+923001234567");
  await page.getByLabel("Approximate active students").fill("30");
  await page.getByLabel("Approximate teachers").fill("4");
  await page.getByLabel("Qaida").check();
  await page.getByText(/I understand DarsFlow/).click();
  await page.getByRole("button",{name:"Request access"}).click();
  await expect(page.getByRole("status")).toContainText("request has been received");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)).toBe(false);
});

test("public policy pages load and lead management is protected",async({page})=>{
  for(const path of ["/privacy","/terms","/contact"]){await page.goto(path);await expect(page.locator("h1")).toBeVisible()}
  await page.goto("/platform/leads");
  await expect(page).toHaveURL(/\/login/);
});

test("unauthenticated academy and export routes are protected",async({page})=>{
  await page.goto("/app/students");
  await expect(page).toHaveURL(/\/login/);
  const response=await page.request.get("/api/exports/lessons",{maxRedirects:0});
  expect([302,307,401,403]).toContain(response.status());
});
