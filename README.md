<h1 align="center" style="text-align: center; width: fit-content; margin-left: auto; margin-right: auto;">env-templater</h1>

<p align="center">
  <a href="https://github.com/dkhunt27/env-templater/actions">CI</a>
  ·
  <a href="https://github.com/dkhunt27/env-templater/releases">Releases</a>
  ·
  <a href="https://github.com/dkhunt27/env-templater/issues">Issues</a>
</p>

<span align="center">

</span>

Creates env files from templates with SSM support for various api clients.

Bruno included

TODO: thunderclient and postman

## Nodenv

You can use nodenv to control the node version installation

```bash
brew install nodenv
nodenv install
nodenv init
```

## Node_modules

Install dependencies and run scripts:

```bash
npm install
npm run build
npm run lint
npm run test
```

Node usage:

```ts
import { runNx, type NxCommandInputs } from "env-templater";

const inputs: NxCommandInputs = {
      command: 'targetedAffected',
      affectedToIgnore: [],
      args: [],
      baseBoundaryOverride: '',
      headBoundaryOverride: '',
      isWorkflowsCiPipeline: false,
      parallel: 3,
      projects: [],
      setNxBranchToPrNumber: false,
      targets: [],
      workingDirectory: '',
    };

await runNx(inputs);
```

## Releasing

- Merge the automated Release PR created by Release Please
- Manually run the "Release" workflow to publish to npm and JSR with provenance

## Template

Started with [ts-base](https://github.com/bgub/ts-base)