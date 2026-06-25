import type { JobApplicationStatus, PrismaClient, UserRole } from "../../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { DEV_LOGIN_ACCOUNTS, E2E_USER } from "../../src/lib/dev-seed.constants";

export type SeedUserSpec = {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
};

export type SeedApplicationSpec = {
  company: string;
  title: string;
  url?: string;
  source?: string;
  status: JobApplicationStatus;
  appliedAt?: Date;
  nextStep?: string;
  notes?: string;
  logs?: { status: JobApplicationStatus; note: string; createdAt?: Date }[];
};

/** Usuario E2E + cuentas listadas en DEV_LOGIN_ACCOUNTS. */
export async function seedDevUsers(prisma: PrismaClient): Promise<void> {
  const specs: SeedUserSpec[] = [
    {
      email: E2E_USER.email,
      name: E2E_USER.name,
      password: E2E_USER.password,
    },
  ];

  for (const email of Object.keys(DEV_LOGIN_ACCOUNTS)) {
    if (email === E2E_USER.email) continue;
    const password = DEV_LOGIN_ACCOUNTS[email];
    if (!password) continue;
    specs.push({ email, name: email.split("@")[0] ?? email, password });
  }

  for (const spec of specs) {
    const passwordHash = await bcrypt.hash(spec.password, 10);
    await prisma.user.upsert({
      where: { email: spec.email },
      create: {
        email: spec.email,
        name: spec.name,
        passwordHash,
        role: spec.role ?? "CUSTOMER",
      },
      update: { name: spec.name, passwordHash },
    });
  }
}

/** Postulaciones demo idempotentes por usuario + empresa + rol. */
export async function seedJobApplicationsForUser(
  prisma: PrismaClient,
  userId: string,
  applications: SeedApplicationSpec[],
): Promise<number> {
  let created = 0;

  for (const spec of applications) {
    const existing = await prisma.jobApplication.findFirst({
      where: { userId, company: spec.company, title: spec.title },
    });

    if (existing) continue;

    await prisma.$transaction(async (tx) => {
      const app = await tx.jobApplication.create({
        data: {
          userId,
          company: spec.company,
          title: spec.title,
          url: spec.url ?? null,
          source: spec.source ?? null,
          status: spec.status,
          appliedAt:
            spec.appliedAt ??
            (spec.status === "SAVED" ? null : new Date()),
          nextStep: spec.nextStep ?? null,
          notes: spec.notes ?? null,
        },
      });

      const logs =
        spec.logs ??
        [
          {
            status: spec.status,
            note: "Seed inicial",
            createdAt: spec.appliedAt,
          },
        ];

      for (const log of logs) {
        await tx.jobApplicationStatusLog.create({
          data: {
            applicationId: app.id,
            status: log.status,
            note: log.note,
            createdAt: log.createdAt ?? spec.appliedAt ?? new Date(),
          },
        });
      }
    });

    created += 1;
  }

  return created;
}

export const E2E_APPLICATIONS: SeedApplicationSpec[] = [
  {
    company: "Thaloz",
    title: "Senior React Engineer",
    source: "LinkedIn inbound",
    status: "SAVED",
    nextStep: "Escribir reactivación a Nayla",
    notes: "Remoto US, 2–3 meses, USD.",
  },
  {
    company: "Acme Remote",
    title: "Staff Frontend Engineer",
    url: "https://example.com/jobs/staff-fe",
    source: "4dayweek.io",
    status: "SCREEN",
    appliedAt: new Date("2026-06-15T10:00:00.000Z"),
    nextStep: "Prep call con hiring manager",
    notes: "Demo E2E — semana de 4 días.",
    logs: [
      {
        status: "APPLIED",
        note: "Aplicación enviada",
        createdAt: new Date("2026-06-10T10:00:00.000Z"),
      },
      {
        status: "SCREEN",
        note: "Respondieron — screen agendado",
        createdAt: new Date("2026-06-15T10:00:00.000Z"),
      },
    ],
  },
];

export const SUPERADMIN_APPLICATIONS: SeedApplicationSpec[] = [
  {
    company: "Lemon.io",
    title: "Head of Engineering",
    url: "https://remotive.com/remote-jobs/software-development/head-of-engineering-2090983",
    source: "Remotive",
    status: "APPLIED",
    appliedAt: new Date("2026-06-20T12:00:00.000Z"),
    nextStep: "Follow-up en 5 días si no hay respuesta",
    notes: "Europe/LATAM OK. Stretch (piden 5–30+ reports).",
    logs: [
      {
        status: "APPLIED",
        note: "Alta inicial — aplicación enviada",
        createdAt: new Date("2026-06-20T12:00:00.000Z"),
      },
    ],
  },
  {
    company: "Thaloz",
    title: "Senior React Engineer",
    source: "LinkedIn inbound",
    status: "SAVED",
    nextStep: "Escribir reactivación",
    notes: "Cliente US vía Nayla Corteguera. Abr 2026.",
  },
  {
    company: "Qindel Group",
    title: "Tech Lead Front-End (React)",
    url: "https://empleo.qindel.com/jobs/tech-lead-front-end-react",
    source: "Qindel / empleo.qindel.com",
    status: "APPLIED",
    appliedAt: new Date("2026-06-25T12:00:00.000Z"),
    nextStep: "Seguimiento si no hay respuesta en 7-10 días",
    notes:
      "A Coruña (publicada 27/05/2026). Liderazgo técnico frontend React, sector retail.",
    logs: [
      {
        status: "APPLIED",
        note: "Aplicación en portal Qindel — ya apuntado a la oferta",
        createdAt: new Date("2026-06-25T12:00:00.000Z"),
      },
    ],
  },
  {
    company: "Intellectsoft",
    title: "Senior React Developer (IR-518)",
    url: "https://apply.workable.com/intellectsoft/j/5F56026C6D",
    source: "Intellectsoft / Workable",
    status: "APPLIED",
    appliedAt: new Date("2026-06-25T16:00:00.000Z"),
    nextStep: "Seguimiento en 7-10 días si no hay respuesta",
    notes:
      "Remote · Full-time · Ref IR-518. Locations: Spain, Poland, Brazil, Argentina.",
    logs: [
      {
        status: "APPLIED",
        note: "Aplicación enviada — confirmación por email",
        createdAt: new Date("2026-06-25T16:00:00.000Z"),
      },
    ],
  },
];

/** Emails de SUPERADMIN_EMAILS + fallback erickorso si existe. */
export function resolveSuperadminSeedEmails(superadminEmailsEnv: string): string[] {
  const fromEnv = superadminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const emails = new Set(fromEnv);
  emails.add("erickorso@gmail.com");
  return [...emails];
}

export async function seedAllJobApplications(
  prisma: PrismaClient,
  superadminEmailsEnv: string,
): Promise<{ e2e: number; superadmin: number }> {
  const e2eUser = await prisma.user.findUnique({ where: { email: E2E_USER.email } });
  if (!e2eUser) {
    throw new Error("Usuario E2E no encontrado — ejecutá seedDevUsers primero");
  }

  const e2eCreated = await seedJobApplicationsForUser(
    prisma,
    e2eUser.id,
    E2E_APPLICATIONS,
  );

  let superadminCreated = 0;
  for (const email of resolveSuperadminSeedEmails(superadminEmailsEnv)) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) continue;

    const lemonOrphan = await prisma.jobApplication.findFirst({
      where: {
        company: "Lemon.io",
        title: "Head of Engineering",
        NOT: { userId: user.id },
      },
    });
    if (lemonOrphan) {
      await prisma.jobApplication.update({
        where: { id: lemonOrphan.id },
        data: { userId: user.id },
      });
    }

    superadminCreated += await seedJobApplicationsForUser(
      prisma,
      user.id,
      SUPERADMIN_APPLICATIONS,
    );
  }

  return { e2e: e2eCreated, superadmin: superadminCreated };
}
