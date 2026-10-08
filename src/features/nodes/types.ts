/**
 * NODE: tour of the data types (`LogicType.*`).
 *
 * Every pin, property, config field and slot is described by a `LogicType` schema. A schema is a
 * plain JSON-like object, so it can be stored in the project, and `Static<typeof schema>` gives
 * its TypeScript type.
 * Schemas can be composed and reused: define them once (like `profileSchema`) and share them
 * between nodes, components and files.
 *
 * Docs: docs/03-type-system.md
 */
import type { Static } from "@luna-park/plugin";
import { LogicType, LogicUtil, makeLogicNode } from "@luna-park/plugin";

/** A reusable object schema. `name` on each property is the label shown in the editor. */
export const profileSchema = LogicType.object({
    // string | number
    id: LogicType.union([LogicType.string(), LogicType.number()], { name: "id" }),
    name: LogicType.string({ name: "name" }),
    age: LogicType.number({ name: "age", optional: true }),
    // Interfaces are named class types ("Date" is built in, see features/interfaces for custom ones)
    createdAt: LogicType.interface<Date>("Date", { name: "created at" }),
    // Record<string, number>
    scores: LogicType.record(LogicType.string(), LogicType.number(), { name: "scores" }),
    tags: LogicType.array(LogicType.string(), { name: "tags" })
}, { name: "profile" });

/** `Static` gives the TypeScript type: `{ name: string; age?: number; tags: string[]; ... }`. */
export type TProfile = Static<typeof profileSchema>;

/** Derive schemas with LogicUtil: pick / omit / partial / required. */
export const profileSummarySchema = LogicUtil.pick(profileSchema, ["name", "tags"]);

export const typesNode = makeLogicNode({
    name: "examples/make-profile",
    inputs: {
        in_name: LogicType.string({ name: "name", placeholder: "Doc Brown" }),
        in_age: LogicType.number({ name: "age", optional: true }),
        in_tags: LogicType.array(LogicType.string(), { name: "tags", default: () => [] })
    },
    outputs: {
        out_profile: profileSchema,
        out_summary: { ...profileSummarySchema, name: "summary" },
        // A function value: (prefix: string) => string. Other nodes can call it.
        out_greet: LogicType.function([["prefix", LogicType.string()]], LogicType.string(), { name: "greet" })
    },
    methods: {
        out_profile() {
            return {
                id: this.in_name.toLowerCase(),
                name: this.in_name,
                age: this.in_age,
                createdAt: new Date(),
                scores: {},
                tags: this.in_tags ?? []
            } satisfies TProfile;
        },
        out_summary() {
            return { name: this.in_name, tags: this.in_tags ?? [] };
        },
        out_greet() {
            const name = this.in_name;
            return (prefix: string) => `${ prefix } ${ name }`;
        }
    },
    display: {
        name: "Make profile (types)"
    },
    documentation: {
        short: "Build an object from inputs",
        description: "Shows object, array, record, union, interface and function types."
    }
});
