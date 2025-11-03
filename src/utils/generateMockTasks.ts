import * as fs from "fs";
import * as path from "path";

console.log("Modules loaded successfully.");

import { makeDemoTasks } from "./taskGenerator";

const tasks = makeDemoTasks(1000);
const filePath = path.resolve(__dirname, "mockTasks.json");

console.log(`Resolved file path: ${filePath}`);
console.log(`Number of tasks generated: ${tasks.length}`);

try {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  console.log(`Mock tasks generated and saved to ${filePath}`);

  // Verify if the file was created
  if (fs.existsSync(filePath)) {
    console.log(`File successfully created at ${filePath}`);
  } else {
    console.error(`File was not created at ${filePath}`);
  }
} catch (error) {
  if (error instanceof Error) {
    console.error(`Failed to write file: ${error.message}`);
  } else {
    console.error(`Failed to write file: ${String(error)}`);
  }
}