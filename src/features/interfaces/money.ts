/**
 * SHARED: the `Money` class behind the "Money" interface.
 *
 * Isomorphic (no DOM, no Node APIs), and exported from `<package>/shared` so generated
 * frontends and backends can build and use `Money` values too.
 */
export class Money {
    amount: number;
    currency: string;

    constructor(amount: number, currency = "EUR") {
        this.amount = amount;
        this.currency = currency.toUpperCase();
    }

    /** Parses "12.50 EUR" (currency optional, EUR by default). */
    static parse(value: string) {
        const [amount = "0", currency = "EUR"] = value.trim().split(/\s+/);
        return new Money(Number.parseFloat(amount) || 0, currency);
    }

    add(other: Money) {
        if (other.currency !== this.currency) {
            throw new Error(`Cannot add ${ other.currency } to ${ this.currency }`);
        }

        return new Money(this.amount + other.amount, this.currency);
    }

    format(locale?: string) {
        return new Intl.NumberFormat(locale, { currency: this.currency, style: "currency" }).format(this.amount);
    }

    toString() {
        return `${ this.amount } ${ this.currency }`;
    }
}
