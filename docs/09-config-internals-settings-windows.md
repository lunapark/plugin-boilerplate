# 09 – Config, internals, settings and windows

## `config`: schema-driven settings
Example: [`src/features/config/`](../src/features/config)

```ts
const configSchema = LogicType.object({
    accent: LogicType.string({ default: "#ff6600", format: "color" }),
    spacing: LogicType.number({ default: 8, options: { min: 0, max: 32, step: 2, clamp: true, suffix: "px" } }),
    density: LogicType.string({ default: "comfortable", enum: { comfortable: "Comfortable", compact: "Compact" } })
});
makePlugin<typeof configSchema, TInternals>({ config: configSchema, … });
```
- The form opens from the plugin's button in the editor header.
- Defaults come from the schema (`getSchemaDefault`) at install time.
- Values are stored at `app.config.plugins[id].config`.
- Available as a typed `env.config` in `lifecycle.*` and in every `editor` / `build` / `inject` option function.
- Each change triggers `lifecycle.update`, and the option functions run again.
- Config is inlined into generated code, so **never put secrets in it**.

## `internals`: free-form persisted state
Example: [`src/features/internals/`](../src/features/internals)

```ts
export const internals = reactive<TInternals>({ apiKey: "", categories: {}, files: {} });
makePlugin({ internals, … });
```
- On load, the saved `app.config.plugins[id].internals` is copied into this object with a **shallow** `Object.assign`, and every change is saved back. A saved top-level key replaces its default entirely, so backfill new nested fields in `lifecycle.mount`.
- Make it `reactive`, so settings components can `v-model` straight into it.
- Give every field a default, because older projects may lack newer fields.
- Available as `env.internals`. Any other module can import it directly.

### config vs internals

| | `config` | `internals` |
|---|---|---|
| UI | auto-generated form | your `settings` components |
| Data | flat typed values | any JSON |
| Triggers `lifecycle.update` | ✅ | ❌ (use `watch`) |
| Typical | colours, toggles, enums | lists, credentials, created file ids, roles |

## `settings`: custom tabs
```ts
settings: [{ component: shallowRef(LSettings), icon: faSliders, label: "General" }]
```
- Each tab is a prop-less Vue component that edits `internals`.
- Build them with `@luna-park/design` (`LInput`, `LCheckbox`, `LButton`, `LDropdown`, `LSwitch`, …) and the editor's CSS variables (`--length-*`, `--font-size-*`, `--color-*`).
- For Histoire stories, wrap a tab in `LSettingsStoryWrapper` (from `@luna-park/plugin`) to preview it at the real popup size.

## `windows`: standalone pages
Example: [`src/features/windows/`](../src/features/windows)

```ts
windows: { Callback: markRaw(LCallbackWindow) }
// → https://luna-park.app/plugin?plugin=<package or URL>&window=Callback
```
- Only your plugin module is loaded. There is no project, `env` or lifecycle.
- Use it for OAuth or payment redirects and popups.
- Talk to the editor with `window.opener.postMessage(data, window.location.origin)`, and check `event.origin` on the receiving side.
- Packages outside `@luna-park/` ask the user to confirm before loading.
