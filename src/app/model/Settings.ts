export class Settings {
    darkMode = true;
    defaultDir?: string | null;

    static default(): Settings {
        return { darkMode: true };
    }
}
