# Release Notes
<style>
    .release_date {
        font-size: 8pt;
        color: #999999;
        position: relative;
        top: -20px;
        margin-top: -0px;
        padding-top: 0px;
    }
</style>

## 2.0.0
<span class="release_date">15 JUL 2026</span>

- Upgraded Node.js target engine to Node 24 (`>=24.x`) across specifications and CI workflows.
- Added `punycode` package override (`^2.3.1`) to resolve `DEP0040` core module deprecation warnings.
- Converted Action runner to a Composite Action (`action.yml`), compiling on demand to eliminate `dist/` binary bloat from Git source control.
- Upgraded `undici` to `^7.28.0` remediating Denial of Service vulnerability (GHSA-vxpw-j846-p89q).
- Corrected input configuration syntax and action reference naming in `README.md`.

## 1.0.0
<span class="release_date">22 JAN 2023</span>

Initial Release, testing in another repository with dynamic test coverage.

## 1.1.0
<span class="release_date">22 JAN 2023</span>

Minor patch, fixing the missing 'sha' for updating badges.

## 1.1.1
<span class="release_date">22 JAN 2023</span>

Patch, removing additional hash computation on file since the hash
is being resolved via the Octokit and not simple SHA-256.