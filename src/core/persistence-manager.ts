class PersistenceManager {
    public static store(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    public static retrieve(key: string): string {
        return localStorage.getItem(key);
    }
}
