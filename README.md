# lcov_gh_badges

## TL;DR

A GitHub Action for creating markdown embeddable badges, saved to your repository, directly from an 
LCOV data file.

## Details

After looking for and testing several options to create a dynamic badge
for code coverage from [Bazel](https://bazel.io), and I couldn't find one that
cleanly read the `bazel coverage //...` output files, so, I created this.
This project is a solution for many repositories that I have under development
to get a quick view on code health from the README.md files.

This work is inspired by the work from schneegans/dynamic-badges-action@v1.6.0
with a difference in that it evaluates the LCOV data format, and downloads
the SVG file from badges.io, saving it to the repository under 'coverage.svg'.

Once generated, it MAY be linked in a README.md or other markdown file.

## Setup

Add the following ignore to your build file:

### Update Build

```yaml
on:
  push:
    branches:
      - main
    paths-ignore:
      - "**/coverage.svg"
  pull_request:
```

> IMPORTANT: YOU MUST ADD THE IGNORE TO YOUR BUILD PROCESS, FAILURE TO DO SO WILL
> CAUSE A BUILD LOOP.

#### Add a step to read the coverage file
```yaml
...
steps:
  - uses: GoogleCloudPlatform/github-badge-lcov@v1.0.0
    file: ./target/coverage.dat
```

### Add the badge

Add the badge file to a README.md file or AsciiDoc as a link.

```markdown
![coverage](coverage.svg)
```
Example:

![coverage](coverage.svg)

## Complete Configuration
```yaml
...
steps:
- uses: GoogleCloudPlatform/github-badge-lcov@v1.0.0
  file: ./target/coverage.dat
  access_token: ${{ secret.COVERAGE_TOKEN }}
  style: flat
  icon_name: googlecloud,
  icon_color: 'ffffff',
  label: 'Coverage'
  label_color: 'ffffff'
  critical: 60
  criticalColor: '9c2c9c'
  warning: 75
  warningColor: 'd68f0c'
  success_color: '43ad43'
  message_color: 'ffffff'
```

## Output Variables

* coverage_functions_found - total functions found
* coverage_functions_hit - total functions hit (any > 0)
* coverage_lines_found total line count
* coverage_lines_hit - total lines hit (any > 0)
* coverage_score - The score lines hit / lines found
* coverage_badge_url - The URL used to generate the badge

### Additional Contributing Information

Please visit the [Google Open Source](https://opensource.google/documentation/reference/releasing/template/CONTRIBUTING)
page for additional information. If you don't have a CLA on file, fill one out, it's there for your protection.

## License

This project is released under the Apache 2.0 license,
please read the [License File](./LICENSE) file, or visit
[Apache 2 License](https://www.apache.org/licenses/LICENSE-2.0)
for more information.



