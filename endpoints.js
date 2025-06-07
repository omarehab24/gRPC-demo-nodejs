/* 
## Endpoints ##
---------------
GET /news 
GET /news/:id 
.
POST /news 
PUT /news/:id 
DELETE /news/:id 
.
GET /newsStream 
*/

// In Node.js, req is a readable stream. This means the request body doesn’t arrive all at once — it arrives in chunks over time.

// You must listen to 'data' and 'end' events to collect and process the body.

const http = require('http');
const client = require('./client');

const host = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
	const url = req.url.split('/');

	if (url[1] === 'news') {
		const id = url[2] ?? null;
		switch (req.method) {
			case 'POST':
				addNews(req, res);
				break;
			case 'GET':
				if (id) {
					getNews(req, res, id);
					return;
				} else getAllNews(req, res);
				break;
			case 'PUT':
				if (id) editNews(req, res, id);
				break;
			case 'DELETE':
				if (id) deleteNews(req, res, id);
				break;
			case 'default':
				break;
		}
	} else if (url[1] === 'newsStream') {
		switch (req.method) {
			case 'GET':
				getNewsStream(req, res);
				break;
			case 'default':
				break;
		}
	} else {
		res.writeHead(404);
		res.end('Not Found');
	}
});

function getNewsStream(req, res) {
	// Set headers once at the start of the response
	res.writeHead(200, {
		'Content-Type': 'application/json',
		'Transfer-Encoding': 'chunked', // Allows sending data in chunks without knowing total length upfront
	});

	const call = client.getNewsStream({});

	call.on('data', newsItem => {
		// Writes part of the response, keeps connection open
		// Parse each message individually by setting a newline between each one
		res.write(JSON.stringify(newsItem) + '\n');
	});

	call.on('end', () => {
		res.end(); // End the HTTP stream when gRPC stream ends
	});

	call.on('error', error => {
		res.writeHead(500, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: error.message }));
	});
}

function deleteNews(req, res, id) {
	let body = '';

	req.on('data', chunk => {
		body += chunk;
	});

	req.on('end', () => {
		client.deleteNews({ id }, (error, response) => {
			if (error) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ error: error.message }));
			} else {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end('Deleted Successfully!');
			}
		});
	});
}

function getNews(req, res, id) {
	let body = '';

	req.on('data', chunk => {
		body += chunk;
	});

	req.on('end', () => {
		client.getNews({ id }, (error, response) => {
			if (error) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ error: error.message }));
			} else {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(response));
			}
		});
	});
}

function editNews(req, res, id) {
	let body = '';

	req.on('data', chunk => {
		body += chunk;
	});
	req.on('end', () => {
		body = JSON.parse(body);

		client.editNews(
			{
				id,
				title: body.title,
				body: body.body,
				postImage: body.postImage,
			},
			(error, response) => {
				if (error) {
					res.writeHead(500, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ error: error.message }));
				} else {
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(response));
				}
			}
		);
	});
}

function getAllNews(req, res) {
	let body = '';

	req.on('data', chunk => {
		body += chunk;
	});

	req.on('end', () => {
		client.getAllNews({}, (error, response) => {
			if (error) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ error: error.message }));
			} else {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(response));
			}
		});
	});
}

function addNews(req, res) {
	let body = '';

	req.on('data', chunk => {
		body += chunk;
	});
	req.on('end', () => {
		body = JSON.parse(body);

		client.addNews(
			{
				id: '-1',
				title: body.title,
				body: body.body,
				postImage: body.postImage,
			},
			(error, response) => {
				if (error) {
					res.writeHead(500, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ error: error.message }));
				} else {
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(response));
				}
			}
		);
	});
}

server.listen(port, () => {
	console.log(`Server is running on http://${host}:${port}`);
});
