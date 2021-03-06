export function randId() {
    const now = Date.now();
    const randNum = Math.random();
    return `${now}-${randNum}`;
}
