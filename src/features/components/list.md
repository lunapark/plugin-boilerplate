# Boilerplate/List

Renders `items` (an array of strings) as a bullet list.

- Slot `item` is **scoped**: inside it, `item` (string) and `index` (number) are available as variables. Use it to render custom markup per row.
- Slot `empty` only exists while `showEmpty` is true. It is shown when `items` is empty.

Typical use: bind `items` to a store array, and put a Text element bound to `item` in the `item` slot.
