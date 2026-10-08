# 10 – Lifecycle

```ts
lifecycle: {
    mount: async (env) => { … },
    update: (env) => { … },
    unmount: (env) => { … }
}
```
These run **in the editor only**. The compiler never calls them.

| Hook | When | Typical use |
|------|------|-------------|
| `mount` | Plugin installed, or project opened with the plugin. May be async | Save `env`, create project files (`env.addFile`), install a Vue plugin, migrate `internals` |
| `update` | After mount and after every `config` change | Apply config to runtime code (CSS variables, `configure…()`) |
| `unmount` | Plugin removed, or editor closed | Undo global side effects: listeners, CSS variables, intervals |

## Order of events
- **Install:** default config + `internals` copy → `mount` → register (merge saved internals, `update`, resolve `editor.*`).
- **Load:** check the id → register (merge internals, `update`, resolve `editor.*`) → `mount`.

So don't assume `mount` runs before `update`: make both idempotent and have both apply the config (as `src/index.ts` does).

The loaded module's `id` must match the stored id ("Plugin id mismatch").

## Saving `env`
Only lifecycle hooks and option functions receive `env`. Store it for the rest of the code:
```ts
// src/lib/env.ts
export const env: Partial<TPluginEnv> = {};
export function setEnv(value: TPluginEnv) { Object.assign(env, value); }

// src/index.ts
mount: (env) => { setEnv(env); … }
```

## Host Vue app
The editor's Vue app instance is at `window.__LUNA_PARK__.app`. The Nuxt UI plugin calls `window.__LUNA_PARK__.app.use(ui)` in `mount` so its components work on the canvas. `env.app` is the **project** (`TApplication`), not the Vue app.

## Idempotency
`mount` runs on every project open. Anything it creates must be checked first:
```ts
if (!internals.files.store || !env.getFile(internals.files.store)) {
    internals.files.store = env.addFile(storeFile).id;
}
```
