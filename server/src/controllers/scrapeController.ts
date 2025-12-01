// src/controllers/scrapeController.ts
import { Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import prisma from "../prisma";
import crypto from "crypto";

export const scrapeGovtJobs = async (req: Request, res: Response) => {
  try {
    console.log("🚀 Scraping started...");

    // 1) change URL to a site you want to scrape (try multiple govt job pages)
    const url = "https://www.ncs.gov.in/Pages/Search.aspx"; // <-- replace with real URL

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0 Safari/537.36"
      },
      timeout: 30000
    });

    const $ = cheerio.load(data);

    // 2) update selector according to site structure
    const jobElements = $(".job-card, .result-vertical, .job-list-item"); // try all likely selectors

    const jobs: Array<any> = [];

    jobElements.each((i, el) => {
      const title = $(el).find(".title, .job-title").text().trim() || $(el).find("h2, h3").first().text().trim();
      const organization = $(el).find(".org, .organization, .company").text().trim() || null;
      const location = $(el).find(".location, .place").text().trim() || null;
      const deadline = $(el).find(".deadline, .last-date, .end-date").text().trim() || null;
      const qualification = $(el).find(".qualification, .edu").text().trim() || null;
      const syllabus = $(el).find(".syllabus, .description, .desc").text().trim() || null;
      const applyLink = $(el).find("a").attr("href") ? new URL($(el).find("a").attr("href")!, url).toString() : null;

      if (title) {
        jobs.push({ title, organization, location, deadline, qualificationRequired: qualification, syllabus, applyLink });
      }
    });

    // 3) save to prisma (upsert using jobHash)
    for (const job of jobs) {
      const hashSource = `${job.title}||${job.organization}||${job.deadline}`;
      const jobHash = crypto.createHash("sha256").update(hashSource).digest("hex");

      await prisma.job.upsert({
        where: { jobHash },
        update: {
          title: job.title,
          organization: job.organization,
          location: job.location,
          deadline: job.deadline,
          qualificationRequired: job.qualificationRequired,
          syllabus: job.syllabus,
          applyLink: job.applyLink
        },
        create: {
          jobHash,
          title: job.title,
          organization: job.organization,
          location: job.location,
          deadline: job.deadline,
          qualificationRequired: job.qualificationRequired,
          syllabus: job.syllabus,
          applyLink: job.applyLink,
          age: null
        }
      });
    }

    console.log("✅ Saved", jobs.length, "jobs");
    return res.json({ success: true, total: jobs.length });

  } catch (error) {
    console.error("SCRAPING ERROR:", error);
    return res.status(500).json({ error: "Scraping failed, check selectors / URL / network" });
  }
};
