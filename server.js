const PROTO_PATH = './news.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// gRPC service definition you loaded from your .proto file, and it's used to bind your server-side handler functions to the RPC methods defined in that service.
const packageDefination = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});
// newsProto contains all the definitions from your .proto file, converted into a usable JavaScript object.
const newsProto = grpc.loadPackageDefinition(packageDefination);

const server = new grpc.Server();

// Asynchronously binds the gRPC server to a network port.
// Recommended from gRPC v1.10.0+
server.bindAsync(
	'127.0.0.1:51234',
	grpc.ServerCredentials.createInsecure(),
	(err, port) => {
		console.log(`Server running at http://127.0.0.1:${port}`);
		// server.start() // @deprecated — No longer needed as of version 1.10.x
	}
);

let news = [
	{ id: '1', title: 'Note 1', body: 'Content 1', postImage: 'Post image 1' },
	{ id: '2', title: 'Note 2', body: 'Content 2', postImage: 'Post image 2' },
];

// When you load the .proto file, newsProto.NewsService becomes an object representing NewsService from the .proto file. Inside it, there’s a .service property that contains method descriptors (metadata about RPC names and input/output types).
server.addService(newsProto.NewsService.service, {
	getAllNews: getAllNews,
	addNews,
	deleteNews,
	editNews,
	getNews,
	getNewsStream,
});

// call: the object containing the incoming request (call.request)
// callback: sends back the response (callback(error, result))
// null as first arg: means no error (success case)

function getAllNews(call, callback) {
	callback(null, { news });
}

function addNews(call, callback) {
	const _news = {
		...call.request,
		id: (news.length + 1).toString(),
	};

	news.push(_news);

	callback(null, _news);
}

function deleteNews(call, callback) {
	const { id } = call.request;

	const newsItem = news.find(n => n.id === id);

	if (!newsItem) callback(new Error('Item is not found!'), {});

	news = news.filter(n => n.id !== id);

	callback(null, {});
}

function editNews(call, callback) {
	const { id, body, title, postImage } = call.request;

	const newsItem = news.find(n => n.id === id);

	if (!newsItem) callback(new Error('Item is not found!'), {});

	newsItem.body = body;
	newsItem.postImage = postImage;
	newsItem.title = title;

	callback(null, newsItem);
}

function getNews(call, callback) {
	const { id } = call.request;

	const newsItem = news.find(n => n.id === id);

	if (!newsItem) callback(new Error('Item is not found!'), {});

	callback(null, newsItem);
}

// What is a Server-Streaming RPC?
// Client sends one request, server sends back a stream of responses (multiple messages). i.e. Stream chunks progressively
// Why Server-Streaming?
// Mainly used for: Fetching large datasets (e.g. list of users or products), Real-time data feeds (e.g. notifications)
function getNewsStream(call, callback) {
	news.forEach(n => call.write(n));

	call.end();
}
