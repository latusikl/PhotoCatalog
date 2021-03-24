import { ChildProcess, spawn } from 'child_process';
import { EventEmitter } from 'events';
import { Transform, TransformCallback } from 'stream';
import * as builder from 'electron-builder';

const ANGULAR_READY = 'angular-ready';
const DEPLOYMENT_DIR = 'deployment';
const eventEmitter = new EventEmitter();

function buildForProduction() {
    // if (fs.existsSync(DEPLOYMENT_DIR)) {
    //     console.log('Removed old deployment directory.');
    //     fs.rmdirSync(DEPLOYMENT_DIR, { recursive: true });
    // }
    // fs.mkdirSync(DEPLOYMENT_DIR);
    console.log('Starting Angular project build');
    const angularChildProcess: ChildProcess = spawn(npmCommand(), ['run', 'build-angular-prod'], {
        cwd: process.cwd(),
        shell: true,
    });

    connectAngularStdStreams(angularChildProcess);
    eventEmitter.on(ANGULAR_READY, () => {
        console.log('Angular ready');
        console.log('Starting electron files build');
        const electronBuildProces: ChildProcess = spawn(npmCommand(), ['run', 'build-electron-prod'], {
            cwd: process.cwd(),
            shell: true,
        });
        electronBuildProces.on('exit', () => {
            console.log('Electron ready');
            runElectronBuilder();
        });
    });
}

function npmCommand(): string {
    if (process.platform == 'win32') {
        return 'npm.cmd';
    } else {
        return 'npm';
    }
}

function connectAngularStdStreams(angularChildProcess: ChildProcess): void {
    angularChildProcess.stdin?.pipe(process.stdin);
    angularChildProcess.stdout?.pipe(angularOutTransform()).pipe(process.stdin);
    angularChildProcess.stderr?.pipe(process.stdin);
}

function angularOutTransform(): Transform {
    return new Transform({
        transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
            const chunkValue = chunk.toString();
            if (chunkValue.includes('Build at')) {
                eventEmitter.emit(ANGULAR_READY);
            }
            callback(null, chunkValue);
        },
    });
}

function runElectronBuilder() {
    console.log('Starting application packing');
    process.env.DEBUG = 'electron-builder';
    builder
        .build({
            config: {
                appId: 'pl.photo.catalog',
                productName: 'Photo Catalog',
                copyright: 'Apache-2.0 License',
                mac: {
                    target: 'dmg',
                },
                linux: {
                    target: ['AppImage', 'deb'],
                },
                win: {
                    target: 'squirrel',
                },
                files: ['./deployment/build/**/*', 'package.json'],
                directories: {
                    output: './deployment',
                },
            },
        })
        .then(() => console.log('Build successful'))
        .catch((e) => console.error(e));
}

buildForProduction();
