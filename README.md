# Luna Park Plugin Boilerplate

This is a boilerplate project for building plugins for **Luna Park**. It provides a structured starting point with example components and logic nodes, set up with Vue 3, TypeScript, and Vite.

## Features

This boilerplate includes examples of:

-   **Custom Components**:
    -   `Sample/MyComponent`: A demonstration component that accepts a `color` property (red, green, blue) and has a default slot.
-   **Logic Nodes**:
    -   `My Function Node`: An example of a flow-based node with execution triggers (`in_exec`, `out_exec`) that performs addition.
    -   `My Operation Node`: An example of a pure data processing node that adds two numbers without execution flow.

## Getting Started

### Prerequisites

-   Node.js (latest LTS recommended)
-   pnpm

### Installation

1.  Clone this repository.
2.  Install dependencies:

    ```bash
    pnpm install
    ```

## Development

### Scripts

-   **Build**: Compiles the plugin for production.
    ```bash
    pnpm build
    ```
-   **Watch**: Compiles the plugin in watch mode for development.
    ```bash
    pnpm dev
    ```
-   **Preview**: Launches the Luna Park preview tool to test your plugin. This will allow you to test your plugin in the editor by providing a URL to it (default: `http://127.0.0.1:2084`).
    ```bash
    pnpm preview
    ```

## Project Structure

-   `src/index.ts`: The main entry point where the plugin is defined using `makePlugin`.
-   `src/components/`: Contains Vue components and their Luna Park definitions.
    -   `myComponent.ts`: Definition for the sample component.
    -   `LMyComponent.vue`: The actual Vue implementation of the component.
    -   `LWrapper.vue`: A wrapper component for the plugin.
-   `src/nodes/`: Contains logic node definitions.
    -   `myFunctionNode.ts`: Definition for the function node.
    -   `myOperationNode.ts`: Definition for the operation node.

## Customization

To add your own components or nodes:

1.  Create your Vue component or node logic in the respective directories.
2.  Define the metadata (inputs, outputs, properties) using `makeLogicNode` or component definitions.
3.  Register them in `src/index.ts` under the `editor.components` or `editor.nodes` arrays.
