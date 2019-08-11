const fs = require('fs');

/**
 * Generate a random ID number
 * @param None
 */
function generateRandomId() {
    return Math.ceil(Math.random() * 10000);
}

/**
 * Save data
 * @param {Object} - accepts an object containing data to be saved 
 */
function save(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * Gets all facts
 * @param None
 */
function getfacts() {
    return new Promise((resolve, reject) => {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const json = JSON.parse(data);
                resolve(json);
            }
        });
    });
}

/**
 * Gets a specific fact by ID
 * @param {number} id - Accepts the ID of the specified fact.
 */
async function getfact(id) {
    const facts = await getfacts();
    return facts.records.find(record => record.id == id);
}
/**
 * Gets a random fact
 * @param None
 */
async function getRandomfact() {
    const facts = await getfacts();
    const randNum = Math.floor(Math.random() * facts.records.length);
    return facts.records[randNum];
}

/**
 * Creates a new fact record
 * @param {Object} newRecord - Object containing info for new fact: the fact text, author and year
 */
async function createfact(newRecord) {
    const facts = await getfacts();

    newRecord.id = generateRandomId();
    facts.records.push(newRecord);
    await save(facts);
    return newRecord;
}

/**
 * Updates a single record 
 * @param {Object} newfact - An object containing the changes to fact: fact, category (all optional)
 */
async function updatefact(newfact) {
    const facts = await getfacts();
    let fact = facts.records.find(item => item.id == newfact.id);

    fact.fact = newfact.fact;
    fact.category = newfact.category;

    await save(facts);
}

/**
 * Deletes a single record
 * @param {Object} record - Accepts record to be deleted. 
 */
async function deletefact(record) {
    const facts = await getfacts();
    facts.records = facts.records.filter(item => item.id != record.id);
    await save(facts);
}

module.exports = {
    getfacts,
    getfact,
    createfact,
    updatefact,
    deletefact,
    getRandomfact
}
