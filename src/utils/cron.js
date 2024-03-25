import { exec } from "child_process";
import { promisify } from "util";

export async function startCron() {
  const execPromise = promisify(exec);

  const { stdout, stderr } = await execPromise("$(pwd)/scripts/new_cron.sh");

  if (stderr) {
    console.log(stderr);
    return 1;
  }

  console.log(stdout);

  return 0;
}

export async function stopCron() {
  const execPromise = promisify(exec);

  const { stdout, stderr } = await execPromise("$(pwd)/scripts/delete_cron.sh");

  if (stderr) {
    console.log(stderr);
    return 1;
  }

  console.log(stdout);

  return 0;
}
