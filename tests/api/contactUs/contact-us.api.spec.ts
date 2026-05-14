import * as fs from "fs";
import * as path from "path";
import { test, expect } from "@playwright/test";
import { validateSchema } from "../../../utils/validateSchema";
import {
  contactUsAttachSchema,
  contactUsSchema,
} from "../../../schemas/contact-us.schema";
import { createContactUsData } from "../../../test-data/contact-us";
import { setAllureMeta } from "../../../utils/allure-utils";

test.describe("Contact Us form API", { tag: ["@api", "@contactUs"] }, () => {
  test(
    "Submit valid form + attach file (binary)",
    { tag: ["@smoke"] },
    async ({ request }) => {
      await setAllureMeta({
        title: "Contact Us - Submit Form with File Attachment",
        description:
          "Verify that valid contact form submission with file attachment returns 200 and validates both responses",
        severity: "critical",
        priority: "P0",
        owner: "QA Team",
        suite: "Contact Us",
        feature: "Form Submission",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "POST /messages + POST /messages/{id}/attach-file",
          Method: "POST",
          RequestType: "JSON + Multipart",
          ExpectedStatus: "200",
        },
      });
      const testData = createContactUsData();
      let messageId: string;
      await test.step("Submit contact form (JSON)", async () => {
        const response = await request.post("/messages", {
          data: {
            name: `${testData.firstName} ${testData.lastName}`,
            subject: testData.subject,
            message: testData.message,
            email: testData.email,
          },
        });

        expect(response.status()).toBe(200);
        const json = await response.json();
        validateSchema(json, contactUsSchema);

        messageId = json.id;
        expect(messageId, "Message ID must be present").toBeTruthy();
      });

      await test.step("Attach file (binary body)", async () => {
        expect(messageId, "Message ID must be defined").toBeDefined();
        const filePath = path.join(process.cwd(), testData.filePath);
        const fileBuffer = fs.readFileSync(filePath);

        const response = await request.post(
          `/messages/${messageId}/attach-file`,
          {
            multipart: {
              file: {
                name: testData.fileName,
                mimeType: "text/plain",
                buffer: fileBuffer,
              },
            },
          },
        );

        expect(response.status()).toBe(200);
        const json = await response.json();
        if (contactUsAttachSchema) {
          validateSchema(json, contactUsAttachSchema);
        }
      });
    },
  );

  test(
    "Submit form with invalid email returns 422",
    { tag: ["@negative"] },
    async ({ request }) => {
      await setAllureMeta({
        title: "Contact Us - Invalid Email Validation",
        description:
          "Verify that submitting contact form with invalid email format returns 422 validation error",
        severity: "normal",
        priority: "P1",
        owner: "QA Team",
        suite: "Contact Us",
        feature: "Form Validation",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "POST /messages",
          Method: "POST",
          TestCase: "Invalid email format",
          ExpectedError: "email validation failed",
          ExpectedStatus: "422",
        },
      });
      const testData = createContactUsData({ email: "not-an-email" });

      await test.step("Send request and verify validation error", async () => {
        const response = await request.post("/messages", {
          data: {
            name: `${testData.firstName} ${testData.lastName}`,
            subject: testData.subject,
            message: testData.message,
            email: testData.email,
          },
        });

        expect(response.status()).toBe(422);
        const json = await response.json();
        expect(JSON.stringify(json).toLowerCase()).toContain("email");
      });
    },
  );
});
