# PhotoCatalog

---

Desktop application created as combination of [Electron](https://www.electronjs.org/) and [Angular](https://angular.io/). Written
entirely in Typescript.

### Basic function of Application:

<details>
<summary>Display images from directory in Gallery view. And filter by:</summary>
* date,
* name,
* resolution,
* focal length,
* F number,
* exposure time.
</details>
<br/>
<details>
<summary>Display and modify most common EXIF data of the image:</summary>

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
<summary> Edit saved in EXIF GPS coordinates using drag & drop on map.</summary>
</details>

### Development

For application there are two runners provided which allows to run application OTB both in production and development mode. Runners are
written in Node.js and might require external installation of `ts-node`.

Related files can be found here:

1. For production mode:

   `electron/runner/prod-runner.ts`

2. For development mode:

   `electron/runner/dev-runner.ts`

### List of most useful commands defined in package.json

Name | Description
--- | ---
start-dev | Runs program in development mode. Both Angular and Electron part are automatically recompiled when saving changes.
start-prof | Runs program using production specification.
build-prod | Compiles Angular and Electron code and creates executable file for used operation system.
install-wsl | Allows to install npm dependencies when using WSL on Windows.

### Electron part of application sources.

Files related to Electron part of app can be found in `electron/src`. Sources are written in Typescript and then compiled to
Javascript. Configuration of application can be found in these files:

1. Used for development:
   `electron/src/electron.dev.ts`
1. Used for development:
   `electron/src/electron.prod.ts`

Registration of Actions related to events received from Angular path has to be done
in: `electron/src/communication/ipc-communication.ts` events names has to be specified in: `electron/src/communication/ipc-events.ts`
