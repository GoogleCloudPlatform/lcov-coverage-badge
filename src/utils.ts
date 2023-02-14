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


import * as core from "@actions/core";
import * as http from "@actions/http-client";
import fs from "fs";
import {COVERAGE_SVG} from "./constants";
import * as fmt from "sprintf-js";
import {Config} from "./config";
import * as github from "@actions/github";

function evaluateString(name: string, fallback: string): string {
    let value = core.getInput(name);
    if (value === null || value === undefined || value.trim() === '') {
        value = fallback
    }
    return value
}

function evaluateNumber(name: string, fallback: number): number {
    let value = core.getInput(name)
    let out = parseInt(value)
    if (isNaN(out) || out >= 0 || out < 100) {
        out = fallback
    }
    return out
}

function generateBadge(config: Config, badgeURL: string) {
    let client: http.HttpClient = new http.HttpClient()
    client.get(badgeURL).then((r: http.HttpClientResponse) => {
        r.readBody().then((b: string) => {
            fs.writeFile(COVERAGE_SVG, b, (err) => {
                if (err) {
                    core.error(fmt.sprintf("Failed to write file: coverage.svg with error: %s\n", err));
                } else {
                    core.notice(fmt.sprintf("Created file: %s", COVERAGE_SVG));
                    writeToGitHub(config)
                }
            })
        })
    })
}

function updateOrCreateFile(accessToken: string, contents: string, sha: string) {
    const context = github.context
    const octokit = github.getOctokit(accessToken);
    octokit.rest.repos.createOrUpdateFileContents({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: COVERAGE_SVG,
        message: 'Update coverage file from lcov_gh_badges',
        content: contents,
        author: {
            name: 'GCOV Github Badge',
            email: 'build@github.com'
        },
        sha: sha
    }).then(o => {
        process.stdout.write("Finished writing file: " + o.data + "\n");
    }).catch(e => {
        process.stderr.write("Failed to create or update File: " + e.message + "\n");
    })
}

function writeToGitHub(config: Config) {
    if (config.accessToken) {
        process.stdout.write("Creating file via Octokit\n");

        const context = github.context
        const octokit = github.getOctokit(config.accessToken);
        const contents = fs.readFileSync(COVERAGE_SVG, {encoding: 'base64'});

        octokit.rest.repos.getContent({
            owner: context.repo.owner,
            repo: context.repo.repo,
            path: COVERAGE_SVG
        }).then(value => {
            if ('data' in value && 'sha' in value.data) {
                const sha: string = value.data.sha as string
                if (sha) {
                    updateOrCreateFile(config.accessToken, contents, sha)
                }
            } else {
                core.warning("Failed to get hash from file, attempting a new file.")
                throw(new Error("Failed to get hash"))
            }
        }).catch(r => {
            process.stdout.write(fmt.sprintf("Attempting to create file: %s\n", r.message));
            updateOrCreateFile(config.accessToken, contents, '')
        })
    }
}

export {evaluateNumber, evaluateString, generateBadge}