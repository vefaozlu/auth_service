import { exec } from "child_process";
import { promisify } from "util";

async function getEpoch({ seconds = false }) {
  const execPromise = promisify(exec);
  const { stdout, stderr } = await execPromise("date +%s");

  if (stderr) {
    return "Error getting epoch time" + stderr;
  }

  if (seconds) {
    return parseInt(stdout);
  }

  return parseInt(stdout) * 1000;
}

export default getEpoch;
