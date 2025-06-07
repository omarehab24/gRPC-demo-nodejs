const client = require('./client');

client.getAllNews({}, (error, response) => {
	console.log('getAllNews:', response);
});

client.addNews(
	{ id: '-1', title: 'Note 3', body: 'Content 3', postImage: 'Post image 3' },
	(error, response) => {
		console.log('addNews:', response);
	}
);

client.editNews(
	{
		id: '2',
		title: 'Note 2 Edited',
		body: 'Content 2 Edited',
		postImage: 'Post image 2 Edited',
	},
	(error, response) => {
		console.log('editNews:', response);
	}
);

client.deleteNews({ id: '2' }, (error, response) => {
	console.log('deleteNews:', response);
});

client.getNews({ id: '1' }, (error, response) => {
	console.log('getNews:', response);
});

const call = client.getNewsStream({});
call.on('data', item => {
	console.log('received item from server ' + JSON.stringify(item));
});

call.on('end', e => console.log('server done!'));
