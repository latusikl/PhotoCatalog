import { ChildProcess, spawn } from 'child_process';
import { EventEmitter } from 'events';
import { Transform, TransformCallback } from 'stream';
import * as path from 'path';

const ANGULAR_READY = 'angular-ready';
const DIRECTORY = path.join('.', 'deployment', 'build');
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
            angularChildProcess.kill('SIGTERM');
            process.exit(0);
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

buildForProduction();
