import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import {
  HackerNewsJobsSource,
  parseHnExternalId,
  parseHnJobCompany,
} from "./hackernews.source";

const FEED_URL = "https://hnrss.org/jobs.jsonfeed";

function mockHnFeed(items: object[]) {
  server.use(
    http.get(FEED_URL, () =>
      HttpResponse.json({
        version: "https://jsonfeed.org/version/1",
        items,
      }),
    ),
  );
}

describe("parseHnJobCompany", () => {
  it("extrae company con batch YC", () => {
    expect(parseHnJobCompany("Hazel (YC W24) Is Hiring for Full Stack")).toBe(
      "Hazel",
    );
  });

  it("extrae company sin batch", () => {
    expect(parseHnJobCompany("Acme Is Hiring Engineers")).toBe("Acme");
  });
});

describe("parseHnExternalId", () => {
  it("parsea id desde item URL", () => {
    expect(
      parseHnExternalId({
        id: "https://news.ycombinator.com/item?id=48761068",
      }),
    ).toBe("48761068");
  });
});

describe("HackerNewsJobsSource", () => {
  it("normaliza vacantes YC del JSON feed", async () => {
    mockHnFeed([
      {
        id: "https://news.ycombinator.com/item?id=48761068",
        title: "Hazel (YC W24) Is Hiring Full Stack Engineer Remote",
        url: "https://www.ycombinator.com/companies/hazel-2/jobs/abc",
        date_published: "2026-07-02T13:14:57Z",
        content_html: "<p>React TypeScript</p>",
      },
    ]);

    const jobs = await new HackerNewsJobsSource().fetchJobs({
      keywords: ["stack"],
    });

    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      source: "hackernews",
      externalId: "48761068",
      company: "Hazel",
      remote: true,
      url: "https://www.ycombinator.com/companies/hazel-2/jobs/abc",
    });
  });

  it("filtra por keyword", async () => {
    mockHnFeed([
      {
        id: "https://news.ycombinator.com/item?id=1",
        title: "Office Assistant (YC S25) Is Hiring",
        url: "https://example.com/job",
      },
    ]);

    const jobs = await new HackerNewsJobsSource().fetchJobs({
      keywords: ["react", "typescript", "node"],
    });
    expect(jobs).toHaveLength(0);
  });

  it("usa fallback Firebase si el feed falla", async () => {
    server.use(
      http.get(FEED_URL, () => new HttpResponse(null, { status: 503 })),
      http.get("https://hacker-news.firebaseio.com/v0/jobstories.json", () =>
        HttpResponse.json([99]),
      ),
      http.get("https://hacker-news.firebaseio.com/v0/item/99.json", () =>
        HttpResponse.json({
          id: 99,
          type: "job",
          title: "Hazel (YC W24) Is Hiring Full Stack Engineer Remote",
          url: "https://www.ycombinator.com/companies/hazel-2/jobs/abc",
          time: 1783848626,
        }),
      ),
    );
    const jobs = await new HackerNewsJobsSource().fetchJobs({
      keywords: ["stack"],
    });
    expect(jobs).toHaveLength(1);
    expect(jobs[0].externalId).toBe("99");
  });
});
