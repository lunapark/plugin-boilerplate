## Cards with lists

Put a `Boilerplate/List` in the default slot of a `Boilerplate/Card`, and the card's actions in its `footer` slot:

```html
<boilerplate:Boilerplate.Card title="Garage" variant="soft">
    <boilerplate:Boilerplate.List :items="cars">
        <template #item="{ item }">
            <txt as="span">{{item}}</txt>
        </template>
    </boilerplate:Boilerplate.List>
    <template #footer>
        <boilerplate:Boilerplate.Counter v-model="count" />
    </template>
</boilerplate:Boilerplate.Card>
```

- Never nest a `Boilerplate/Card` directly inside another one: use the `soft` variant for inner groups instead.
- Use the List `empty` slot for the empty state instead of a separate element next to the card.
