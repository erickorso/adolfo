import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { JobCard } from "./job-card";
import type { JobVM } from "@/domain/jobs/job.types";

const job: JobVM = {
  id: "job_1",
  source: "greenhouse",
  company: "acme",
  title: "Frontend Engineer",
  location: "Remote - LATAM",
  remote: true,
  url: "https://jobs.example/1",
  postedAt: new Date("2026-01-01T00:00:00Z"),
};

describe("JobCard", () => {
  it("muestra título, empresa y ubicación", () => {
    render(<JobCard job={job} />);
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText(/acme · Remote - LATAM/)).toBeInTheDocument();
  });

  it("muestra el badge Remoto cuando corresponde", () => {
    render(<JobCard job={job} />);
    expect(screen.getByText("Remoto")).toBeInTheDocument();
  });

  it("oculta el badge Remoto si no es remoto", () => {
    render(<JobCard job={{ ...job, remote: false }} />);
    expect(screen.queryByText("Remoto")).not.toBeInTheDocument();
  });

  it("enlaza a la oferta original en pestaña nueva", () => {
    render(<JobCard job={job} />);
    const link = screen.getByRole("link", { name: "Ver oferta" });
    expect(link).toHaveAttribute("href", "https://jobs.example/1");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
