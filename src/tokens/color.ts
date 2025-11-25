import { ETokenType, type TToken } from "@luna-park/plugin";

export const colorTokens = [
    {
        id: "primary",
        name: "Primary color",
        type: ETokenType.Color,
        value: "var(--bp-color-primary)"
    }
] satisfies Array<TToken>;
