import { ETokenType, type TToken } from "@luna-park/plugin";

export const lengthTokens = [
    {
        id: "length-m",
        name: "Length M",
        type: ETokenType.Length,
        value: "var(--bp-length-m)"
    },
    {
        id: "length-l",
        name: "Length L",
        type: ETokenType.Length,
        value: "var(--bp-length-l)"
    }
] satisfies Array<TToken>;
