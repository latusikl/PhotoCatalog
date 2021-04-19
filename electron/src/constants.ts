import * as path from 'path';

export default class ElectronConstants {
    static readonly WINDOW_HEIGHT = 800;
    static readonly WINDOW_WIDTH = 1200;
    static readonly MIN_WINDOW_HEIGHT = 600;
    static readonly MIN_WINDOW_WIDTH = 600;
    static readonly ICON_SOURCE_DEV = path.join('.', 'src', 'favicon.ico');
    static readonly ICON_SOURCE_PROD = path.join('..', '..', 'favicon.ico');
    static readonly APP_PATH_PROD = path.join(__dirname, '..', '..', 'angular', 'index.html');
    static readonly CONFIG_FILE = 'cfg.json';
}
