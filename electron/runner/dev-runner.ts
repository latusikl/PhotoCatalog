import { ChildProcess, spawn } from 'child_process';
import { EventEmitter } from 'events';
import { Transform, TransformCallback } from 'stream';
import * as os from 'os';

const ANGULAR_READY = 'angular-ready';
const eventEmitter = new EventEmitter();

function runInDevMode() {
    const angularChildProcess: ChildProcess = spawn(npmCommand(), ['run', 'ng-dev'], {
        cwd: process.cwd(),
        shell: true,
    });

    connectAngularStdStreams(angularChildProcess);
    eventEmitter.on(ANGULAR_READY, () => {
        const electronChildProcess: ChildProcess = spawn(npmCommand(), ['run', 'electron-dev'], {
            cwd: process.cwd(),
            shell: true,
        });
        connectElectronStreams(electronChildProcess);
        eventEmitter.removeAllListeners();
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
            if (chunkValue.includes('Compiled successfully')) {
                eventEmitter.emit(ANGULAR_READY);
            }
            callback(null, chunkValue.split(os.EOL).join(`${os.EOL}[Angular] `));
        },
    });
}

function connectElectronStreams(electronChildProcess: ChildProcess): void {
    electronChildProcess.stdin?.pipe(process.stdin);
    electronChildProcess.stdout?.pipe(electronOutTransform()).pipe(process.stdin);
    electronChildProcess.stderr?.pipe(process.stdin);
}

function electronOutTransform(): Transform {
    return new Transform({
        transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
            const chunkValue = chunk.toString();
            callback(null, chunkValue.split(os.EOL).join(`${os.EOL}[Electron] `));
        },
    });
}

runInDevMode();
