import * as path from 'path';

export default class ElectronConstants {
    static WINDOW_HEIGHT = 800;
    static WINDOW_WIDTH = 1200;
    static ICON_SOURCE_DEV = path.join('.', 'src', 'favicon.ico');
    static ICON_SOURCE_PROD = path.join('..', '..', 'favicon.ico');
    static APP_PATH_PROD = path.join(__dirname, '..', '..', 'angular', 'index.html');
}
