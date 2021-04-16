export default class IpcEvents {
    static ToMain = class {
        static SELECT_DIR = 'select-dir';
        static GET_IMG = 'get-images';
        static GET_IMG_NUM = 'get-images-number';
        static GET_IMG_PAGE = 'get-images-page';
        static READ_SETTINGS = 'read-settings';
        static SAVE_SETTINGS = 'save-settings';
    };

    static ToRendered = class {
        static DIR_SELECTED = 'dir-selected';
        static IMG_FOUND = 'images-found';
        static IMG_NUM = 'images-number';
        static IMG_PAGE_FOUND = 'images-page-found';
        static SETTINGS_READY = 'settings-ready';
    };
}
