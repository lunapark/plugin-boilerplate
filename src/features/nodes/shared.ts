/**
 * SHARED helpers: isomorphic code that works in the browser and in Node.
 *
 * Exported from `<package>/shared`. Don't use `window`, `document`, Node built-ins or Vue here.
 */
export function formatGreeting(name: string, signature?: string) {
    const greeting = `Hello, ${ name || "stranger" }!`;
    return signature ? `${ greeting }\n— ${ signature }` : greeting;
}
