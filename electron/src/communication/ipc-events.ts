export default class IpcEvents {
    static ToMain = class {
        static readonly SELECT_DEFAULT_DIR = 'select-default-dir';
        static readonly SELECT_DIR = 'select-dir';
        static readonly GET_IMG = 'get-images';
        static readonly MODIFY_EXIF = 'modify-exif';
        static readonly READ_SETTINGS = 'read-settings';
        static readonly SAVE_SETTINGS = 'save-settings';
        static readonly SELECT_IMG = 'select-img';
    };
    static ToRendered = class {
        static readonly DIR_SELECTED = 'dir-selected';
        static readonly DEFAULT_DIR_SELECTED = 'default-dir-selected';
        static readonly IMG_FOUND = 'images-found';
        static readonly MODIFY_EXIF_RESULT = 'modify-exif-result';
        static readonly SETTINGS_READY = 'settings-ready';
        static readonly IMG_SELECTED = 'img-selected';
    };
}
