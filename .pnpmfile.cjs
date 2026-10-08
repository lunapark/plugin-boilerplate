/**
 * pnpm hook: makes `@luna-park/design` installable without a Font Awesome Pro licence.
 *
 * `@luna-park/design` declares the Font Awesome *Pro* icon packages as peer dependencies. They are
 * not on the public npm registry, so pnpm fails when it tries to auto-install them.
 * At runtime the Luna Park editor already provides `@luna-park/design` (it is an external, see
 * vite.config.ts), so the plugin never ships those packages. We only need design for its types and
 * for local builds, and removing the Pro peers here is safe.
 *
 * If you have a Pro licence you can delete this file and use the Pro icons instead.
 */
function readPackage(pkg) {
    if (pkg.name === "@luna-park/design" && pkg.peerDependencies) {
        for (const name of Object.keys(pkg.peerDependencies)) {
            if (name.startsWith("@fortawesome/pro-")) {
                delete pkg.peerDependencies[name];
            }
        }
    }

    return pkg;
}

module.exports = {
    hooks: {
        readPackage
    }
};
