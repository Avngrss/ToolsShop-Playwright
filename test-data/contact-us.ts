import { generateUniqueEmail } from "../utils/emailGenerator";

export interface ContactUsData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  fileName: string;
  filePath: string;
}

export interface PartialContactUsData {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
  fileName?: string;
  filePath?: string;
}

export const createContactUsData = (
  overrides: PartialContactUsData = {},
): ContactUsData => {
  const firstName = overrides.firstName || "John";
  const lastName = overrides.lastName || "Doe";

  return {
    firstName,
    lastName,
    email: overrides.email || generateUniqueEmail("contact"),
    subject: overrides.subject || "customer-service",
    message:
      overrides.message ||
      "Test message from automated test via API or UI to verify success message.",
    fileName: overrides.fileName || "testFile.txt",
    filePath: overrides.filePath || "test-data/files/testFile.txt",
    ...overrides,
  };
};
