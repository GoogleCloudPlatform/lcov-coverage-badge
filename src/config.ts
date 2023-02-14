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

import {Defaults, Icons, Props} from "./constants";
import * as util from "./utils";
import * as core from '@actions/core'
import * as fmt from 'sprintf-js'

/**
 * The configuration object holds the state of
 * configuration for the executor can generate the files
 * correctly.
 */
class Config {
    accessToken: string;
    file: string;
    style: string;
    label: string;
    labelColor: string;
    messageColor: string;
    icon: string;
    iconColor: string;
    criticalThreshold: number;
    criticalColor: string;
    warningThreshold: number;
    warningColor: string;
    successColor: string;

    constructor() {
        this.accessToken = util.evaluateString(Props.ACCESS_TOKEN, '');
        this.file = util.evaluateString(Props.FILE, '');
        this.style = util.evaluateString(Props.STYLE, Defaults.STYLE);
        this.icon = util.evaluateString(Props.ICON, Defaults.ICON);
        this.label = util.evaluateString(Props.LABEL, Defaults.LABEL);
        this.labelColor = util.evaluateString(Props.COLOR_LABEL, Defaults.COLOR_LABEL);
        this.messageColor = util.evaluateString(Props.COLOR_MESSAGE, Defaults.COLOR_MESSAGE);
        this.iconColor = util.evaluateString(Props.COLOR_ICON, Defaults.COLOR_ICON);
        this.criticalThreshold = util.evaluateNumber(Props.THRESHOLD_CRITICAL, Defaults.THRESHOLD_CRITICAL);
        this.criticalColor = util.evaluateString(Props.COLOR_CRITICAL, Defaults.COLOR_CRITICAL);
        this.warningThreshold = util.evaluateNumber(Props.THRESHOLD_WARNING, Defaults.THRESHOLD_WARNING);
        this.warningColor = util.evaluateString(Props.COLOR_WARNING, Defaults.COLOR_WARNING);
        this.successColor = util.evaluateString(Props.COLOR_SUCCESS, Defaults.COLOR_SUCCESS);
    }

    computeColor(coverage: number): string {
        if (this.criticalThreshold >= coverage) {
            return this.criticalColor;
        }

        if (this.criticalThreshold < coverage &&
            this.warningThreshold >= coverage) {
            return this.warningColor;
        }

        return this.successColor;
    }

    validate() {
        let valid = true
        if (!this.file) {
            valid = false;
            core.error("DAT file not set");
        }
        return valid
    }

    /**
     * Generates the URL for fetching the SVG file.
     * @param coverage
     */
    imageURL(coverage: number): string {
        let parts = new Array<String>();
        parts.push(fmt.sprintf(Icons.LABEL, this.label));
        parts.push(fmt.sprintf(Icons.LABEL_COLOR, this.labelColor));
        parts.push(fmt.sprintf(Icons.LOGO, this.icon));
        parts.push(fmt.sprintf(Icons.LOGO_COLOR, this.iconColor));
        parts.push(fmt.sprintf(Icons.COLOR, this.computeColor(coverage)));
        parts.push(fmt.sprintf(Icons.STYLE, this.style));
        parts.push(fmt.sprintf(Icons.MESSAGE, coverage))
        return Icons.PREFIX + parts.join('&') + `%`;
    }
}

export {Config}

