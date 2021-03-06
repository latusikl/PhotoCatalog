import { ChildProcess, spawn } from 'child_process';
import { EventEmitter } from 'events';
import { Transform, TransformCallback } from 'stream';
import * as builder from 'electron-builder';
import path from 'path';
import fs from 'fs';

const ANGULAR_READY = 'angular-ready';
const DEPLOYMENT_DIR = 'deployment';
const eventEmitter = new EventEmitter();

function buildForProduction(): void {
    if (fs.existsSync(DEPLOYMENT_DIR)) {
        console.log('Removed old deployment directory.');
        fs.rmdirSync(DEPLOYMENT_DIR, { recursive: true });
    }
    fs.mkdirSync(DEPLOYMENT_DIR);
    console.log('Starting Angular project build');
    const angularChildProcess: ChildProcess = spawn(npmCommand(), ['run', 'build-angular-prod'], {
        cwd: process.cwd(),
        shell: true,
    });

    //Bypass issue with piping streams in Windows
    if (isWindows()) {
        angularChildProcess.on('exit', () => {
            console.log('Angular ready');
            executeElectronBuildAndPackage();
        });
    } else {
        connectAngularStdStreams(angularChildProcess);
        eventEmitter.on(ANGULAR_READY, () => {
            console.log('Angular ready');
            executeElectronBuildAndPackage();
        });
    }
}

function npmCommand(): string {
    if (isWindows()) {
        return 'npm.cmd';
    } else {
        return 'npm';
    }
}

function isWindows(): boolean {
    return process.platform === 'win32';
}

function executeElectronBuildAndPackage(): void {
    console.log('Starting electron files build');
    const electronBuildProces: ChildProcess = spawn(npmCommand(), ['run', 'build-electron-prod'], {
        cwd: process.cwd(),
        shell: true,
    });
    electronBuildProces.on('exit', () => {
        console.log('Electron ready');
        runElectronBuilder();
    });
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

function runElectronBuilder(): void {
    console.log('Starting application packing');
    process.env.DEBUG = 'electron-builder';
    builder
        .build({
            config: {
                appId: 'pl.photo.catalog',
                productName: 'Photo Catalog',
                copyright: 'Apache-2.0 License',
                icon: path.join(__dirname, '..', 'src', 'assets', 'icon.png'),
                mac: {
                    target: 'dmg',
                },
                linux: {
                    target: ['AppImage', 'deb'],
                },
                win: {
                    target: 'portable',
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
