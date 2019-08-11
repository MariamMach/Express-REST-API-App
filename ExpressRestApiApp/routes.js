const express = require('express');
const router = express.Router();

const records = require('./records');

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

router.get('/greetings', (req, res) => {
    res.json({ greeting: "Hello World!" });
});


// send a Get request to /facts to read a list of facts
router.get('/facts', asyncHandler(async (req, res) => {
    const facts = await records.getfacts();
    res.json(facts);
}));

// send a Get request to /facts/:id to read a fact 
router.get('/facts/:id', asyncHandler(async (req, res) => {
    const fact = await records.getfact(req.params.id);
    if (fact) {
        res.json(fact);
    } else {
        res.status(404).json({ message: "Fact not found." });
    }
}));

// send a Get request to /facts/fact/random to read a random fact
router.get('/facts/fact/random', asyncHandler( async (req, res) => {
    const fact = await records.getRandomfact();
    res.json(fact);
}));

// send a Post request to /facts to create a new fact
router.post('/facts', asyncHandler(async (req, res) => {
    if (req.body.fact && req.body.category) {
        const fact = await records.createfact({
            fact: req.body.fact,
            category: req.body.category
        });
        res.status(201).json(fact);
    } else {
        res.status(400).json({ message: "Bad request fact and category required." });
    }
}));

// send a Put request to /facts/:id to update a fact
router.delete('/facts/:id', asyncHandler(async (req, res) => {
    const fact = await records.getfact(req.params.id);
    if (fact) {
        await records.deletefact(fact);
        res.status(204).end();
    } else {
        res.status(404).json({ message: "fact not found." });
    }
}));

// send a Delete request to /facts/:id to delete a fact
router.put('/facts/:id', asyncHandler(async (req, res) => {
    const fact = await records.getfact(req.params.id);
    if (fact) {
        fact.fact = req.body.fact;
        fact.category = req.body.category;
        await records.updatefact(fact);
        res.status(204).end();
    } else {
        res.status(404).json({ message: "fact not found." });
    }
}));

module.exports = router;