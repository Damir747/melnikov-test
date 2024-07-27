const axios = require('axios');
const { MongoClient } = require('mongodb');

const url = 'mongodb://mongo:27017'; // замена localhost на mongo
const dbName = 'eosTracker';
const client = new MongoClient(url);


async function fetchData() {
	try {
		const response = await axios.post('https://eos.greymass.com/v1/history/get_actions', {
			account_name: 'eosio',
			pos: -1,
			offset: -100
		});

		return response.data.actions;
	} catch (error) {
		console.error('Error fetching data:', error);
		return [];
	}
}

async function saveData(actions) {
	try {
		await client.connect();
		const db = client.db(dbName);
		const collection = db.collection('actions');

		for (const action of actions) {
			const { trx_id, block_time, block_num } = action;

			const existing = await collection.findOne({ trx_id });
			if (!existing) {
				await collection.insertOne({ trx_id, block_time, block_num });
				console.log('Inserted new action:', trx_id);
			}
		}
	} catch (error) {
		console.error('Error saving data:', error);
	} finally {
		await client.close();
	}
}

async function main() {
	while (true) {
		const actions = await fetchData();
		await saveData(actions);
		console.log('Waiting for next fetch...');
		await new Promise(resolve => setTimeout(resolve, 60000));
	}
}

main();
