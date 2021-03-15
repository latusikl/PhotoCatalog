# PhotoCatalog

## Run app in dev mode

During app running in dev-mode Angular project is triggered using *ng serve* command and Electron window is listening on *localhost:4200*. Thanks to that live reload is possible while working on Angular part of project.
To run whole app in dev mode use predefined script:

```shell
npm run start
```

Script executes couple of actions:

- It runs *dev-runner.ts* which using Node.js creates 2 subprocesses one for Angular and Second for Electron.
- Electron process is started after initial compilation of Angular project in order to avoid a manual refresh of window (usually it takes longer to start Angular project than Electron task).
- Electron configuration has been rewritten to Typescript therefore initial compilation is done when starting defined task.
- All IPC communication handlers should be placed in ipc-communication.ts and will be registered.
