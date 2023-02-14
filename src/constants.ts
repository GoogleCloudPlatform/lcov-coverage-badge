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

/**
 * The constants file hold all constant objects.
 */
const COVERAGE_SVG = "coverage.svg";
/**
 * Defines the output variables used by the action.
 */
const Outputs = {
    COVERAGE_FUNCTIONS_FOUND: 'coverage_functions_found',
    COVERAGE_FUNCTIONS_HIT: 'coverage_functions_hit',
    COVERAGE_LINES_FOUND: 'coverage_lines_found',
    COVERAGE_LINES_HIT: 'coverage_lines_hit',
    COVERAGE_SCORE: 'coverage_score',
    COVERAGE_BADGE_URL: 'coverage_badge_url',
}

/**
 * Defines the default values used if not specified.
 */
const Defaults = {
    STYLE: 'flat',
    ICON: 'googlecloud',
    LABEL: "Coverage",
    THRESHOLD_CRITICAL: 60,
    THRESHOLD_WARNING: 75,
    COLOR_ICON: 'ffffff',
    COLOR_LABEL: '363d45',
    COLOR_MESSAGE: 'ffffff',
    COLOR_SUCCESS: '43ad43',
    COLOR_WARNING: 'd68f0C',
    COLOR_CRITICAL: '9c2c2c'
}

/**
 * The property names used in the action.yml file.
 */
const Props = {
    ACCESS_TOKEN: "access_token",
    FILE: 'file',
    STYLE: 'style',
    ICON: 'icon_name',
    LABEL: 'label',
    THRESHOLD_CRITICAL: 'critical',
    THRESHOLD_WARNING: 'warning',
    COLOR_ICON: 'icon_color',
    COLOR_LABEL: 'label_color',
    COLOR_MESSAGE: 'message_color',
    COLOR_SUCCESS: 'success_color',
    COLOR_WARNING: 'warning_color',
    COLOR_CRITICAL: 'critical_color'
}

/**
 * The constants used for building the SVG URL.
 */
const Icons = {
    PREFIX: 'https://img.shields.io/static/v1?',
    LABEL: 'label=%s',
    LABEL_COLOR: 'labelColor=%s',
    LOGO: 'logo=%s',
    LOGO_COLOR: 'logoColor=%s',
    COLOR: 'color=%s',
    STYLE: 'style=%s',
    MESSAGE: 'message=%s'
}

export {Defaults, Props, Icons, Outputs, COVERAGE_SVG}