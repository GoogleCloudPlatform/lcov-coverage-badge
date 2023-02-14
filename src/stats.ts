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

// A data structure for LCOV Stats

import * as fs from 'fs';

const LCOV = {
    SOURCE_FILE: 'SF', // SF:pkg/proto/annotation.go
    FUNCTIONS_FOUND: 'FNF', //FNF:0
    FUNCTIONS_HIT: 'FNH', // FNH:0
    LINES_FOUND: 'LF', // LF:12
    LINES_HIT: 'LH', //LH:12
    LINE_NUMBER_AND_HIT_COUNT: 'DA', // DA:28,1
    END_OF_RECORD: 'end_of_record' // end_of_record
}

const TOKEN = {
    COLON: ':',
    COMMA: ','
}

class LineNumberHitCount {
    lineNumber: number = 0;
    hitCount: number = 0;

    constructor(input: string) {
        if (input.startsWith(LCOV.LINE_NUMBER_AND_HIT_COUNT)) {
            let startIndex = input.indexOf(TOKEN.COLON) + 1;
            let values = input.substring(startIndex).split(TOKEN.COMMA)
            if (values.length === 2) {
                this.lineNumber = parseInt(values[0]);
                this.hitCount = parseInt(values[1])
            }
        }
    }
}

/**
 * The statistics state holder object.
 */
class FileStats {
    sourceFile: string;
    functionsFound: number = 0;
    functionsHit: number = 0;
    linesFound: number = 0;
    linesHit: number = 0;
    lineNumberHitCounts: Array<LineNumberHitCount> = new Array<LineNumberHitCount>();

    constructor(sourceFile: string) {
        sourceFile = sourceFile.substring(LCOV.SOURCE_FILE.length + 1)
        this.sourceFile = sourceFile;
    }

    insertLineNumberHitCount(line: string) {
        this.lineNumberHitCounts.push(new LineNumberHitCount(line))
    }

    evaluate(line: string) {
        if (line.startsWith(LCOV.END_OF_RECORD)) {
            return false;
        } else {
            let colonIndex = line.indexOf(TOKEN.COLON)
            let token = line.substring(0, colonIndex)
            let values = line.substring(colonIndex + 1).split(TOKEN.COMMA)
            switch (token) {
                case LCOV.FUNCTIONS_FOUND:
                    this.functionsFound = parseInt(values[0]);
                    break;
                case LCOV.FUNCTIONS_HIT:
                    this.functionsHit = parseInt(values[0]);
                    break;
                case LCOV.LINE_NUMBER_AND_HIT_COUNT:
                    this.insertLineNumberHitCount(line);
                case LCOV.LINES_FOUND:
                    this.linesFound = parseInt(values[0]);
                    break;
                case LCOV.LINES_HIT:
                    this.linesHit = parseInt(values[0])
            }
        }
        return true;
    }
}

class LcovStats {
    fileName: string;
    processed: boolean = false;
    linesFound: number = 0;
    linesHit: number = 0;
    functionsFound: number = 0;
    functionsHit: number = 0;
    fileStats: Array<FileStats> = new Array<FileStats>();

    constructor(fileName: string) {
        this.fileName = fileName;
        this.read();
    }

    read() {
        if (!this.processed) {
            let content = fs.readFileSync(this.fileName, 'utf-8')
            let fileStats: FileStats;
            content.split(/\r?\n/).forEach(line => {
                if (line.startsWith(LCOV.SOURCE_FILE)) {
                    fileStats = new FileStats(line)
                }
                if (!fileStats.evaluate(line)) {
                    this.fileStats.push(fileStats);
                    this.linesFound += fileStats.linesFound;
                    this.linesHit += fileStats.linesHit;
                    this.functionsFound += fileStats.functionsFound;
                    this.functionsHit += fileStats.functionsHit
                }
            });
            this.processed = true
        } else {
            process.stdout.write(`Attempted to read file ${this.fileName} again`)
        }
    }

    coverage() {
        let out = Math.round((this.linesHit / this.linesFound) * 100);
        if (isNaN(out)) {
            out = 0;
        }
        return out;
    }
}

export {LcovStats}