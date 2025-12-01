import type { Request, Response } from "express";
import prisma from "../prisma";
import crypto from "crypto";

type RawJob = Record<string, any>;

function safeString(v: any) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

// 🧹 Helper to clean location strings
function cleanLocation(loc: any): string {
  if (!loc) return "Not specified";
  let cleaned = safeString(loc);

  // Try parsing if JSON-like
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      const valid = parsed.filter(
        (x) => typeof x === "string" && x.trim() !== "" && isNaN(Number(x))
      );
      if (valid.length) return valid.join(", ");
      return "Not specified";
    }
  } catch {
    // not JSON, continue
  }

  // Remove symbols and numeric junk
  cleaned = cleaned.replace(/[\[\]\\"]/g, "").trim();
  if (!cleaned || /^[0-9]+$/.test(cleaned)) return "Not specified";
  return cleaned;
}

export const fetchJobsFromApi = async (req: Request, res: Response) => {
  try {
    const API_URL =
      "https://pgrkamadmin.pgrkam.com/m_api/v1/index.php/search-job/index";

    const body = new URLSearchParams();
    body.append("education_level", req.query.education_level?.toString() ?? "7");
    body.append("job_type", req.query.job_type?.toString() ?? "2");
    body.append("job_title", req.query.job_title?.toString() ?? "");
    body.append("govtType", req.query.govtType?.toString() ?? "2");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/plain, */*",
        Origin: "https://pgrkam.com",
        Referer:
          "https://pgrkam.com/search-results/?education_level=7&job_type=2&govtType=2",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ success: false, message: "Upstream error", details: text });
    }

    const json: any = await response.json();
    const jobsArray: RawJob[] = Array.isArray(json?.data) ? json.data : [];
    console.log("Fetched jobs:", jobsArray.length);

    let saved = 0;
    for (const raw of jobsArray) {
      const title = safeString(raw.job_title ?? "No Title");
      const organization = safeString(raw.org_name ?? raw.company_name ?? "Not Available");
      const location = cleanLocation(raw.location);
      const deadline = safeString(raw.expiring_on ?? raw.last_date ?? "");
      const qualificationRequired = safeString(
        raw.qualification ?? raw.display_qualification ?? raw.required_qualification ?? ""
      );
      const syllabus = safeString(raw.pdf_link ?? "");
      const applyLink = safeString(raw.apply_link ?? "");
      const experience = safeString(raw.experience ?? "");
      const govt = safeString(raw.govt ?? "");
      const age =
        raw.age_preference
          ? Number(raw.age_preference)
          : raw.min_age
          ? Number(raw.min_age)
          : null;

      const jobHash = crypto
        .createHash("sha256")
        .update(`${raw.id}|${title}|${organization}`)
        .digest("hex");

      await prisma.job.upsert({
        where: { jobHash },
        update: {
          title,
          organization,
          location,
          deadline,
          qualificationRequired,
          syllabus,
          applyLink,
          age,
          experience,
          govt,
        },
        create: {
          jobHash,
          title,
          organization,
          location,
          deadline,
          qualificationRequired,
          syllabus,
          applyLink,
          age,
          experience,
          govt,
        },
      });

      saved++;
    }

    return res.json({ success: true, total: jobsArray.length, saved });
  } catch (err: any) {
    console.error("fetchJobsFromApi error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: err.message ?? err,
    });
  }
};
  