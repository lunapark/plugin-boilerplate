import { LogicType, type TComponent } from "@luna-park/plugin";

import LMyComponent from "@/components/LMyComponent.vue";

export const myComponent = {
    component: LMyComponent,
    name: "Sample/MyComponent",
    properties: {
        color: LogicType.string({ default: "red", enum: ["red", "green", "blue"] })
    },
    slots: {
        default: LogicType.void()
    }
} satisfies TComponent;
