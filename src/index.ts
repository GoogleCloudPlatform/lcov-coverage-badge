/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as core from '@actions/core';
import {Config} from "./config";
import {LcovStats} from "./stats";
import {Outputs} from "./constants";
import {generateBadge} from "./utils";

/**
 * This is the main program executed by the action.
 * The steps are as follows:
 *
 * 1) Read the LCOV file.
 * 2) Update the stats in the stats object.
 * 3) Generate a coverage report.
 * 4) Use the coverage report to call badges.io and generate the SVG file.
 * 5) Download the file.
 * 6) If there is an access token, check the file into GitHub.
 *
 * The file may then be accessed via a simple URL in and README file.
 */
async function run() {
    try {
        let config = new Config();

        if (!config.validate()) {
            core.error('Invalid Configuration, please check the logs');
            core.setFailed("Invalid Configuration");
        }

        // Compute the statistics
        let stats = new LcovStats(config.file);
        let coverage = stats.coverage();

        // Generate the badge URL
        let badgeURL = config.imageURL(coverage);

        // Generate the Badge File
        generateBadge(config, badgeURL)
        process.stdout.write("Generated Badge\n");

        // Set Output
        core.setOutput(Outputs.COVERAGE_FUNCTIONS_FOUND, stats.functionsFound);
        core.setOutput(Outputs.COVERAGE_FUNCTIONS_HIT, stats.functionsHit);
        core.setOutput(Outputs.COVERAGE_LINES_FOUND, stats.linesFound);
        core.setOutput(Outputs.COVERAGE_LINES_HIT, stats.linesHit);
        core.setOutput(Outputs.COVERAGE_SCORE, coverage);
        core.setOutput(Outputs.COVERAGE_BADGE_URL, badgeURL);
    } catch (e) {
        if (e instanceof Error) {
            core.error("Failed execution of the executor: " + e.message);
            core.setOutput("COVERAGE_STATUS", false);
        } else {
            core.notice("Coverage Complete");
            core.setOutput("COVERAGE_STATUS", true);
        }
    }
}

export {run}

run();