import { ChildProcess, spawn } from 'child_process';
import { EventEmitter } from 'events';
import { Transform, TransformCallback } from 'stream';
import * as os from 'os';

const ANGULAR_READY = 'angular-ready';
const eventEmitter = new EventEmitter();

function runInDevMode(): void {
    const angularChildProcess: ChildProcess = spawnAngularProcess();
    if (!isWindows()) {
        connectAngularStdStreams(angularChildProcess);
        eventEmitter.on(ANGULAR_READY, () => {
            const electronChildProcess = spawnElectronProcess();
            addListenerToElectronProcess(angularChildProcess, electronChildProcess);
            connectElectronStreams(electronChildProcess);
            eventEmitter.removeAllListeners();
        });
    } else {
        addListenerToElectronProcess(angularChildProcess, spawnElectronProcess());
    }
}

function spawnAngularProcess(): ChildProcess {
    return spawn(npmCommand(), ['run', 'ng-dev'], {
        cwd: process.cwd(),
        shell: true,
    });
}

function spawnElectronProcess(): ChildProcess {
    return spawn(npmCommand(), ['run', 'nodemon'], {
        cwd: process.cwd(),
        shell: true,
    });
}

function addListenerToElectronProcess(angularChildProcess: ChildProcess, electronChildProcess: ChildProcess): void {
    electronChildProcess.on('exit', () => {
        angularChildProcess.kill('SIGTERM');
        process.exit(0);
    });
}

function isWindows(): boolean {
    return process.platform === 'win32';
}

function npmCommand(): string {
    if (isWindows()) {
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
