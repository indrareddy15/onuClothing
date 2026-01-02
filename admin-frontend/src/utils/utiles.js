import { load } from '@cashfreepayments/cashfree-js';

let cashfree;

async function initializeCashfree() {
    cashfree = await load({
        mode: "sandbox" // or "production"
    });
}

initializeCashfree();

export { cashfree };
