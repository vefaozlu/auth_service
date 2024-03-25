import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function startCron() {
  const { stdout, stderr } = await execPromise("$(pwd)/scripts/new_cron.sh");

  if (stderr) {
    console.log(stderr);
    return 1;
  }

  console.log(stdout);

  return 0;
}

export async function stopCron() {
  const { stdout, stderr } = await execPromise("$(pwd)/scripts/delete_cron.sh");

  if (stderr) {
    console.log(stderr);
    return 1;
  }

  console.log(stdout);

  return 0;
}
