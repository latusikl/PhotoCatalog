import * as path from 'path';

export default class ElectronConstants {
    static readonly WINDOW_HEIGHT = 800;
    static readonly WINDOW_WIDTH = 1200;
    static readonly MIN_WINDOW_HEIGHT = 480;
    static readonly MIN_WINDOW_WIDTH = 540;
    static readonly APP_PATH_PROD = path.join(__dirname, '..', '..', 'angular', 'index.html');
}
