import * as allure from "allure-js-commons";
import { AllureMeta } from "../types/meta";

export async function setAllureMeta(meta: AllureMeta): Promise<void> {
  if (meta.title) await allure.displayName(meta.title);
  if (meta.description) await allure.description(meta.description);
  await allure.severity(meta.severity);
  await allure.label("owner", meta.owner);
  await allure.label("priority", meta.priority);

  if (meta.suite) await allure.label("suite", meta.suite);
  if (meta.feature) await allure.feature(meta.feature);

  if (meta.qaseCaseId) {
    const qaseBaseUrl = process.env.QASE_BASE_URL;
    await allure.link(
      `${qaseBaseUrl}?id=${meta.qaseCaseId}`,
      `Qase #${meta.qaseCaseId}`,
    );
  }

  if (meta.parameters) {
    for (const [key, value] of Object.entries(meta.parameters)) {
      await allure.parameter(key, value);
    }
  }
}
