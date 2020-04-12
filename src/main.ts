import * as core from '@actions/core';
import * as inputHelper from './input-helper';
import { execute } from './executor';
import { InputSettings } from './input-settings';

async function run(): Promise<void> {
  try {
    const settings: InputSettings = inputHelper.getInputs();
    execute(settings);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
