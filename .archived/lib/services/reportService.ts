
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export interface Report {
  id: string;
  chatId: string;
  content: string;
  metadata: {
    questions: string[];
    generatedAt: string;
  };
}

export const reportService = {
  async getReportById(id: string): Promise<Report | null> {
    const report = await db.report.findUnique({
      where: { id }
    });
    if (report) {
      return {
        ...report,
        metadata: report.metadata as { questions: string[]; generatedAt: string }
      };
    }
    return null;
  },

  async createReport(data: Omit<Report, 'id'>): Promise<Report> {
    const report = await db.report.create({
      data
    });
    return {
      ...report,
      metadata: report.metadata as { questions: string[]; generatedAt: string }
    };
  },

  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    const report = await db.report.update({
      where: { id },
      data
    });
    return {
      ...report,
      metadata: report.metadata as { questions: string[]; generatedAt: string }
    };
  }
};

