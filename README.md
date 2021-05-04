# PhotoCatalog

---

Desktop application created as combination of [Electron](https://www.electronjs.org/) and [Angular](https://angular.io/). Written
entirely in Typescript.

### Basic function of Application:

<details>
<summary>Display and filter images from directory in Gallery view.</summary>

You can filter images by:

* date,
* file name,
* resolution,
* focal length,
* F number,
* exposure time.

</details>
<br/>
<details>
<summary>Display and modify most common EXIF data of the image.</summary>

The following data can be modified:

* date and time,
* focal length,
* F number,
* exposure time,
* X dimension,
* Y dimension,
* ISO speed rating,
* camera manufacturer,
* software

</details>
<br/>
<details>
<summary>Edit GPS coordinates using drag & drop on map.</summary>
</details>

### Development

For application there are two runners provided. Each runner allows running application out of the box. The difference is mode in which
application will run. One is intended to run application as close as possible to production version. The second one is intended for
development. They are written in Node.js and might require external installation of `ts-node`.

Related files:

1. For production mode:

   `electron/runner/prod-runner.ts`

2. For development mode:

   `electron/runner/dev-runner.ts`

### List of most useful commands defined in package.json

Name | Description
--- | ---
start-dev | Runs program in development mode. Both Angular and Electron parts are automatically recompiled when saving changes.
start-prof | Runs program using production specification.
build-prod | Compiles whole application and creates executable file for used operation system.
install-wsl | Allows to install npm dependencies when using WSL on Windows.

### Electron part of application sources.

Files related to Electron part of the app can be found in `electron/src`. Sources are written in Typescript and then compiled to
Javascript.

Configuration of application can be found in these files:

1. Used for development:
   `electron/src/electron.dev.ts`
1. Used for development:
   `electron/src/electron.prod.ts`

Registration of actions related to events exchanged between main and renderer processes have to be specified
in: `electron/src/communication/ipc-communication.ts`. Additionally, events names have to be specified
in: `electron/src/communication/ipc-events.ts` for clarity of code.
