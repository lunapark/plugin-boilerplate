# Feature: windows

Full-page plugin views served by Luna Park at `https://luna-park.app/plugin?plugin=<target>&window=<key>`.

| File | Role |
|------|------|
| `LCallbackWindow.vue` | The `Callback` window: posts its query params to `window.opener` and closes |
| `LWindowsSettings.vue` | Settings tab that opens the window as a popup and shows what comes back |
| `url.ts` | `getWindowUrl(key, target?, params?)` |
| `index.ts` | The `windows` record and the extra `settings` tab |

## What a window has (and doesn't)
- ✅ Your plugin module, Vue, `vue-router`, `@luna-park/design`, and the URL query params.
- ❌ No project, no `env`, and no `lifecycle` hook runs. `internals` holds only its defaults.
- Packages outside `@luna-park/` ask the user to confirm before loading.

## Security
Post messages only to `window.location.origin`, and check `event.origin` and the message shape in the listener.

## Remove it
Delete the folder and remove `windows` and `windowsSettings` from `src/index.ts`.

Docs: [09 – config, internals, settings, windows](../../../docs/09-config-internals-settings-windows.md)
