import * as core from '@actions/core';
import { InputSettings } from './input-settings';

/**
 * Gets the inputs from user's workflow file.
 *
 * @return {InputSettings} an object with user's settings
 */
export function getInputs(): InputSettings {
  const ignore: string = core.getInput('ignore');
  const useGitWorkspaceRoot: string = core.getInput('use_git_root');
  const mainDirectory: string = core.getInput('main_dir');
  const relativePath: string = core.getInput('path');
  const packageName: string = core.getInput('package');
  const testFile: string = core.getInput('test_file');

  const inputSettings: InputSettings = {
    ignoreFiles: ignore.split(',').map((value: string) => value.trim()),
    useGitRoot: useGitWorkspaceRoot === 'false' ? false : true,
    mainDir: mainDirectory,
    path: relativePath.trim(),
    package: packageName,
    file: testFile
  };

  return inputSettings;
}
