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

import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { evaluateString, evaluateNumber } from '../src/utils.js';

describe("Utils Tests", function() {
    beforeEach(() => {
        // Clear env vars before each test so we have a clean slate
        delete process.env['INPUT_MY_STRING'];
        delete process.env['INPUT_MY_NUMBER'];
    });

    describe("evaluateString", () => {
        it("should return the fallback when the input is missing", () => {
            const result = evaluateString('my_string', 'fallback_value');
            expect(result).to.equal('fallback_value');
        });

        it("should return the fallback when the input is an empty string", () => {
            process.env['INPUT_MY_STRING'] = '   ';
            const result = evaluateString('my_string', 'fallback_value');
            expect(result).to.equal('fallback_value');
        });

        it("should return the input value when it exists", () => {
            process.env['INPUT_MY_STRING'] = 'hello_world';
            const result = evaluateString('my_string', 'fallback_value');
            expect(result).to.equal('hello_world');
        });
    });

    describe("evaluateNumber", () => {
        it("should return the fallback when the input is missing", () => {
            const result = evaluateNumber('my_number', 42);
            expect(result).to.equal(42);
        });

        it("should return the fallback when the input is NaN", () => {
            process.env['INPUT_MY_NUMBER'] = 'not_a_number';
            const result = evaluateNumber('my_number', 42);
            expect(result).to.equal(42);
        });

        it("should return the fallback when the input is not between 0 and 100", () => {
            process.env['INPUT_MY_NUMBER'] = '-5';
            expect(evaluateNumber('my_number', 42)).to.equal(42);

            process.env['INPUT_MY_NUMBER'] = '105';
            expect(evaluateNumber('my_number', 42)).to.equal(42);
        });

        it("should return the parsed number when valid", () => {
            process.env['INPUT_MY_NUMBER'] = '75';
            const result = evaluateNumber('my_number', 42);
            expect(result).to.equal(75);
        });
    });
});
