export default class IpcEvents {
    static ToMain = class {
        static readonly SELECT_DIR = 'select-dir';
        static readonly GET_IMG = 'get-images';
        static readonly GET_IMG_NUM = 'get-images-number';
        static readonly GET_IMG_PAGE = 'get-images-page';
        static readonly MODIFY_EXIF = 'modify-exif';
        static READ_SETTINGS = 'read-settings';
        static SAVE_SETTINGS = 'save-settings';
    };
    static ToRendered = class {
        static readonly DIR_SELECTED = 'dir-selected';
        static readonly IMG_FOUND = 'images-found';
        static readonly IMG_NUM = 'images-number';
        static readonly IMG_PAGE_FOUND = 'images-page-found';
        static readonly MODIFY_EXIF_RESULT = 'modify-exif-result';
        static SETTINGS_READY = 'settings-ready';
    };
}
