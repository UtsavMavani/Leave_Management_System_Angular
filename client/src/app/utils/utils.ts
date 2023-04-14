export function setSessionStorageItem(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSessionStorageItem(key: string): any {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export function clearSessionStorageItem(): void {
    sessionStorage.clear();
}




