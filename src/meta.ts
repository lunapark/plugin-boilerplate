/**
 * Plugin identity and import targets, kept in one place.
 *
 * When you fork the boilerplate, rename things here (and in package.json). Everything else
 * reads from these constants.
 */
import packageDefinition from "../package.json" with { type: "json" };

/**
 * Unique, stable plugin id. Projects store plugin data under this key
 * (`app.config.plugins[PLUGIN_ID]`), so never change it after you publish.
 * Plugin items are namespaced with it:
 * - nodes: `<id>/<node.name>`
 * - tokens: `plugin/<id>/<token.id>`
 * - guards: `<id>/<guard.id>`
 * - inputs: `<id>/<key>`
 */
export const PLUGIN_ID = "boilerplate";

/** npm package name. The editor loads the plugin from `https://esm.sh/<PACKAGE_NAME>`. */
export const PACKAGE_NAME = packageDefinition.name;

/** Version installed in generated apps that import the runtime/server/shared entries. */
export const PACKAGE_VERSION = packageDefinition.version;

/**
 * Import targets used by generated code (`build.imports`, `build.generate`, injections).
 * They must match the "exports" field of package.json and the entries in vite.config.ts.
 */
export const RUNTIME_TARGET = `${ PACKAGE_NAME }/runtime`;
export const SERVER_TARGET = `${ PACKAGE_NAME }/server`;
export const SHARED_TARGET = `${ PACKAGE_NAME }/shared`;

/**
 * Prefix for every CSS variable, global name and env key the plugin creates, so it never
 * collides with the app or with other plugins.
 */
export const CSS_PREFIX = "--bp";
export const ENV_PREFIX = "BOILERPLATE";
