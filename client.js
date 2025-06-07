const PROTO_PATH = './news.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefination = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});
const NewsService = grpc.loadPackageDefinition(packageDefination).NewsService;

const client = new NewsService(
	'localhost:51234',
	grpc.credentials.createInsecure()
);

module.exports = client