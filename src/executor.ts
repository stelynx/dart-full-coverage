import * as core from '@actions/core';
import * as childProcess from 'child_process';
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

  let changeDirStr = '';
  if (settings.useGitRoot) {
    changeDirStr += 'cd $GITHUB_WORKSPACE && ';
  } else if (settings.mainDir?.length > 0) {
    changeDirStr += `cd ${settings.mainDir} && `;
  }

  return `${changeDirStr}echo "// ignore_for_file: unused_import" > ${
    settings.file
  } && find ${
    settings.path
  } -name '*.dart' ${excludeString.trim()} -exec grep -L "part of" {} \\; | cut -c4- | awk '{printf "import '\\''package:${
    settings.package
  }%s'\\'';\\n", $1}' >> ${settings.file} && echo "void main(){}" >> ${
    settings.file
  } && echo "\nProcessing completed. Output file in ${
    settings.file
  }:\n" && cat ${settings.file}`;
}
