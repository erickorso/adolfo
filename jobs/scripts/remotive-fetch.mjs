const MIN_YEAR = 60_000;

const titleKw =
  /frontend|front-end|front end|react|next\.?js|typescript|javascript|software developer|software engineer|tech lead|staff|architect|engineering lead|head of engineering|full.?stack/i;
const exclude =
  /sales|office assistant|data label|quality assurance rater|copywriter|video editor|pharmacist|medical|writer|payable|data analyst|data scientist|rails|ruby|ios developer|android|wordpress|salesforce|qa rater/i;

function parseSalary(s) {
  if (!s) return null;
  const t = s.toLowerCase();
  let m = t.match(/\$(\d[\d,]*)\s*-\s*\$?(\d[\d,]*)\s*\/\s*h/);
  if (m)
    return {
      min: Number(m[1].replace(/,/g, "")) * 160 * 12,
      max: Number(m[2].replace(/,/g, "")) * 160 * 12,
    };
  m = t.match(/\$(\d[\d,]*)\s*\/\s*h/);
  if (m) return { min: Number(m[1].replace(/,/g, "")) * 160 * 12, max: null };
  m = t.match(/\$(\d[\d.]*k?)\s*[-–]\s*\$?(\d[\d.]*k?)/);
  if (m) {
    const parseK = (x) => {
      x = x.replace(/,/g, "");
      if (x.endsWith("k")) return parseFloat(x) * 1000;
      return parseFloat(x) * (Number(x) < 1000 ? 1000 : 1);
    };
    return { min: parseK(m[1]), max: parseK(m[2]) };
  }
  m = t.match(/\$(\d[\d.]*k)/);
  if (m) {
    const v = parseFloat(m[1]) * 1000;
    return { min: v, max: v };
  }
  return null;
}

function meetsMin(salaryStr) {
  const sal = parseSalary(salaryStr);
  if (!sal) return true;
  return sal.min >= MIN_YEAR;
}

const res = await fetch("https://remotive.com/api/remote-jobs");
const data = await res.json();

const jobs = (data.jobs ?? [])
  .filter((j) => {
    const text = `${j.title} ${(j.tags ?? []).join(" ")}`;
    if (exclude.test(text)) return false;
    if (!titleKw.test(text)) return false;
    return meetsMin(j.salary ?? "");
  })
  .map((j) => ({
    title: j.title,
    company: j.company_name,
    type: j.job_type,
    loc: j.candidate_required_location || "Worldwide",
    salary: j.salary || "n/d",
    url: j.url,
  }));

console.log(`Remotive API — dev/frontend >= $${MIN_YEAR}/yr · worldwide (free sample: ${jobs.length} jobs)\n`);
for (const j of jobs) {
  console.log(`${j.title}`);
  console.log(`  ${j.company} · ${j.type} · ${j.loc}`);
  console.log(`  ${j.salary}`);
  console.log(`  ${j.url}\n`);
}
