import * as childProcess from 'child_process';
import * as core from '@actions/core';
import { InputSettings } from './input-settings';

export function execute(settings: InputSettings): void {
  const cmd = buildCommand(settings);

  core.info(`\nExecuting command:\n${cmd}`);
  childProcess.exec(
    cmd,
    (
      error: childProcess.ExecException | null,
      stdout: string,
      stderr: string
    ) => {
      if (error) core.setFailed(error.message);
      core.info(stdout);
      core.error(stderr);
    }
  );
}

function buildCommand(settings: InputSettings): string {
  let excludeString = '';
  for (const str of settings.ignoreFiles) {
    excludeString += `-and -not -name '${str}' `;
  }

  return `cd $GITHUB_WORKSPACE &&
      echo "// ignore_for_file: unused_import" > ${settings.file} &&
      find ${settings.path} -name '*.dart' ${excludeString.trim()} 
      | cut -c4-
      | awk '{printf "import '\\''package:${
        settings.package
      }%s'\\'';\\n", $1}' >> ${settings.file} &&
      echo "void main(){}" >> ${settings.file} &&
      echo "\nProcessing completed. Output file in ${settings.file}:\n" &&
      cat ${settings.file}`;
}
