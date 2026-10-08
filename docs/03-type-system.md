# 03 – Type system (`LogicType`)

Everything typed in Luna Park is a `LogicType` schema: node pins, node config, component properties, slots, models, emits, panel properties, plugin config, guard config, database columns and store fields. A schema is a plain serialisable object, and `Static<typeof schema>` gives its TypeScript type.

Example: [`src/features/nodes/types.ts`](../src/features/nodes/types.ts)

## Builders

| Builder | TS type | Notes |
|---------|---------|-------|
| `LogicType.exec(args?)` | – | Execution pin (flow). Nodes only |
| `LogicType.string(args?)` | `string` | `format: "color" \| "email" \| "date-time"` changes the input |
| `LogicType.number(args?)` | `number` | |
| `LogicType.boolean(args?)` | `boolean` | |
| `LogicType.object(props?, args?)` | `{…}` | `optional: true` on a property makes it `?:` |
| `LogicType.array(items, args?)` | `T[]` | `multiple: true` turns it into a variadic node input |
| `LogicType.record(key, value, args?)` | `Record<K, V>` | key is a string or number schema |
| `LogicType.union([a, b], args?)` | `A \| B` | |
| `LogicType.interface<T>(classOrName, args?)` | `T` | built-in (`"Date"`, …) or plugin interfaces |
| `LogicType.function(params, output?, args?)` | `(...) => R` | params: `[["name", schema], …]` or an object schema. `promise: true` makes it async |
| `LogicType.type(target[], args?)` | – | reference to a user-defined type |
| `LogicType.unknown(args?)` | `unknown` | |
| `LogicType.undefined(args?)` | `undefined` | |
| `LogicType.void(args?)` | `void` | plain slots, events without a payload |

## Common arguments (`TArguments`)

| Arg | Effect |
|-----|--------|
| `name` | Label in the editor |
| `description` | Help text / tooltip |
| `default` | Default value, or a function returning it (use a function for arrays and objects) |
| `optional` | Value may be undefined. Panel properties start hidden. `Static` adds `\| undefined` |
| `placeholder` | Input placeholder |
| `enum` | `["a", "b"]` (labels = values) or `{ value: "Label" }` (shows labels, stores values) |
| `format` | `"color"`, `"email"`, `"date-time"` |
| `multiple` | Array input split into N pins (nodes) |
| `promise` | The value or exec is asynchronous |
| `dynamic` | `({ config, inputs, outputs }) => TSchema`. The real schema is computed from the node or element state (see [04](04-nodes.md#dynamic-types)) |
| `customizable` | On objects, the user may add fields (database columns, …) |
| `priority` | Sort hint |
| `example` | Documentation example |
| `options` | Free-form editor options (below) |

## `options.*`

| Option | Read by | Effect |
|--------|---------|--------|
| `input: "<pluginId>/<key>"` | All property inputs | Use a custom input component ([08](08-inputs-and-interfaces.md)) |
| `token: ETokenType.X` | Style and property inputs | Offer design tokens of that type |
| `min`, `max`, `step`, `clamp` | Number inputs | Range and snapping |
| `suffix` | Number inputs | Display suffix (`"px"`, `"ms"`) |
| `units` | Style inputs | Unit selector |
| `icon` | String inputs | Icon picker |
| `hidden` | Element panels: `true` or `(values) => boolean`. Type selectors: `true` | Hide the field |
| `freeze` | Files (stores, databases) | The user can't edit or delete the field |
| `readonly` | Database rows | The value can't be edited by hand |
| `insert` | Database or store root | Where user-added fields are inserted (e.g. `-2`) |
| `foreignKey` | Database | Foreign-key column (see [13](13-files-and-templates.md)) |
| `access` | – | Access schema |

Your own keys are allowed (e.g. `colors` for a custom input).

## `LogicUtil`
```ts
LogicUtil.pick(objSchema, ["a", "b"]);
LogicUtil.omit(objSchema, ["c"]);
LogicUtil.partial(objSchema);      // every property optional
LogicUtil.required(objSchema);     // every property required
LogicUtil.promise(schema);         // mark as promise
```
Use them to derive component props or node outputs from a shared schema. The Nuxt UI plugin uses `LogicUtil.omit(LinkProps, ["custom"]).properties`, for instance.

## `Static`
```ts
const user = LogicType.object({ id: LogicType.string(), age: LogicType.number({ optional: true }) });
type TUser = Static<typeof user>; // { id: string; age?: number }
```

## Tips
- Keep schemas in constants and reuse them, so types and labels stay consistent.
- Spread a schema to override its label: `{ ...profileSchema, name: "summary" }`.
- Self-referencing schemas (trees) can be built by assigning `properties.children` after construction.
