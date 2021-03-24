import { ChildProcess, spawn } from 'child_process';
import { EventEmitter } from 'events';
import { Transform, TransformCallback } from 'stream';
import * as path from 'path';
import * as builder from 'electron-builder';

const ANGULAR_READY = 'angular-ready';
const DIRECTORY = path.join('..', 'deployment', 'build');
const DIRECTORY_ANGULAR = path.join(DIRECTORY, 'angular');
const eventEmitter = new EventEmitter();

function buildForProduction() {
    const angularChildProcess: ChildProcess = spawn(
        'ng',
        ['build', '--prod', '--output-path', DIRECTORY_ANGULAR, '--base-href', './'],
        {
            cwd: process.cwd(),
            shell: true,
        },
    );
    process.env.DEBUG = 'electron-builder';
    connectAngularStdStreams(angularChildProcess);
    eventEmitter.on(ANGULAR_READY, () => {
        console.log('Angular ready');
        const electronBuildProces: ChildProcess = spawn(
            'tsc',
            ['-p', './electron/src/tsconfig.prod.json', '--outDir', DIRECTORY],
            {
                cwd: process.cwd(),
                shell: true,
            },
        );
        electronBuildProces.on('exit', () => {
            console.log('Electron ready');
            runElectronBuilder();
        });
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

function runElectronBuilder() {
    builder
        .build({
            targets: builder.Platform.MAC.createTarget(),
            config: {
                appId: 'pl.photo.catalog',
                productName: 'Photo Catalog',
                copyright: 'Apache-2.0 License',
                dmg: {
                    contents: [
                        {
                            x: 110,
                            y: 150,
                        },
                        {
                            x: 240,
                            y: 150,
                            type: 'link',
                            path: '/Applications',
                        },
                    ],
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
        .then(() => console.log('Build successfull'))
        .catch((e) => console.error(e));
}

buildForProduction();
