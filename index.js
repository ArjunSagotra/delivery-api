const express = require('express');
const app = express();

app.use(express.json());

const centers = {
    C1: ['A', 'B', 'D', 'E'],
    C2: ['C', 'F', 'G'],
    C3: ['H', 'I']
};

const distanceCost = {
    C1: 10,
    C2: 12,
    C3: 15
};

const PRODUCT_WEIGHT = 0.5;
const PER_KM_COST = 2;

const calculateMinCost = (order) => {
    const productCenters = {};

    for (const [center, products] of Object.entries(centers)) {
        for (const product of products) {
            if (!productCenters[product]) productCenters[product] = [];
            productCenters[product].push(center);
        }
    }

    let minCost = Infinity;

    for (const start of Object.keys(centers)) {
        let totalCost = 0;

        for (const [product, qty] of Object.entries(order)) {
            const availableCenters = productCenters[product];
            if (!availableCenters) continue;

            let dist;
            if (availableCenters.includes(start)) {
                dist = distanceCost[start];
            } else {
                dist = Math.min(...availableCenters.map(c => distanceCost[c]));
            }

            const tripCost = 2 * dist * PRODUCT_WEIGHT * PER_KM_COST * qty;
            totalCost += tripCost;
        }

        if (totalCost < minCost) minCost = totalCost;
    }

    return Math.round(minCost);
};

app.post('/', (req, res) => {
    const order = req.body;
    const cost = calculateMinCost(order);
    res.json({ minimum_cost: cost });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
