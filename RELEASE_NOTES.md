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