/**
 * SHARED helper: HMAC-SHA256 signature with the Web Crypto API.
 *
 * `crypto.subtle` exists in browsers and in Node ≥ 19, so the editor (browser) and the
 * generated backend (Node) run the same code.
 */
export async function signText(secret: string, text: string) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret || "missing-secret"), { hash: "SHA-256", name: "HMAC" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(text));

    return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
