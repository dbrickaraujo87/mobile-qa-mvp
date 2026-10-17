import fs from "fs";
import path from "path";

interface TestRecord {
  suite: string;
  title: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

const collectedTests: TestRecord[] = [];

export const config = {
  runner: "local",
  port: 4723,
  maxInstances: 1,
  specs: ["./test/specs/**/*.spec.ts"],
  capabilities: [
    {
      platformName: "Android",
      "appium:automationName": "UiAutomator2",
      "appium:deviceName": "Android Emulator",
      "appium:app": path.join(process.cwd(), "./apps/demo-app.apk"),
      "appium:autoGrantPermissions": true,
      "appium:newCommandTimeout": 240,
    },
  ],
  logLevel: "info",
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
  afterTest(
    test: { parent?: string; title: string },
    _context: unknown,
    result: { passed: boolean; duration: number; error?: { message?: string } },
  ) {
    collectedTests.push({
      suite: test.parent || "Mobile E2E Suite",
      title: test.title,
      passed: result.passed,
      durationMs: result.duration || 0,
      error: result.error?.message,
    });
  },
  after() {
    const reportsDir = path.join(process.cwd(), "reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const failures = collectedTests.filter((t) => !t.passed).length;
    const totalTimeSec = (
      collectedTests.reduce((acc, t) => acc + t.durationMs, 0) / 1000
    ).toFixed(2);
    const suiteName = collectedTests[0]?.suite || "Mobile E2E Suite";

    const xmlLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<testsuites tests="${collectedTests.length}" failures="${failures}" time="${totalTimeSec}" timestamp="${new Date().toISOString()}">`,
      `  <testsuite name="${suiteName.replace(/"/g, "&quot;")}" tests="${collectedTests.length}" failures="${failures}" time="${totalTimeSec}">`,
    ];

    for (const t of collectedTests) {
      const sec = (t.durationMs / 1000).toFixed(2);
      const safeTitle = t.title.replace(/"/g, "&quot;");
      const safeClass = t.suite.replace(/"/g, "&quot;");
      if (t.passed) {
        xmlLines.push(
          `    <testcase classname="${safeClass}" name="${safeTitle}" time="${sec}" />`,
        );
      } else {
        const safeErr = (t.error || "Assertion failed").replace(/"/g, "&quot;");
        xmlLines.push(
          `    <testcase classname="${safeClass}" name="${safeTitle}" time="${sec}"><failure message="${safeErr}"/></testcase>`,
        );
      }
    }
    xmlLines.push("  </testsuite>");
    xmlLines.push("</testsuites>");

    fs.writeFileSync(
      path.join(reportsDir, "junit-results.xml"),
      xmlLines.join("\n"),
      "utf-8",
    );
  },
};
