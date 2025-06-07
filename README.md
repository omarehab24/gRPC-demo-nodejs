This is a simple demo showcasing the use of gRPC client and server methods in Node.js.

### What is gRPC?
per gRPC's documentation page:

"gRPC is a modern open source high performance Remote Procedure Call (RPC) framework that can run in any environment. It can efficiently connect services in and across data centers with pluggable support for load balancing, tracing, health checking and authentication."

It is mainly used in distributed systems and microservices.

It uses HTTP/2 for data transport and protocol buffers for data serialization, this results in improved performance and reduced latency compared to HTTP/1.1 and faster data serialization and deserialization as protocol buffers are binary.

### What is a Protocol Buffer?
per gRPC's documentation page:

"It’s like JSON, except it’s smaller and faster, and it generates native language bindings. You define how you want your data to be structured once, then you can use special generated source code to easily write and read your structured data to and from a variety of data streams and using a variety of languages."

"Protocol buffers are a combination of the definition language (created in .proto files), the code that the proto compiler generates to interface with data, language-specific runtime libraries, the serialization format for data that is written to a file (or sent across a network connection), and the serialized data."

Some of the advantages of using protocol buffers include:

    Compact data storage
    Fast parsing
    Availability in many programming languages
    Optimized functionality through automatically-generated classes

-------------------

In this demo, I used gRPC's node.js library to test drive its functionality. All the methods used in this demo will be called via HTTP methods for demonstration purposes.

### Steps

1. In the terminal:

    - npm install
    - node server.js
    - node endpoints.js (or test.js to log all the methods to the console)

2. test the below endpoints using cURL, postman, ...etc

### Endpoints

GET /news 
GET /news/:id 
.
POST /news 
PUT /news/:id 
DELETE /news/:id 
.
GET /newsStream

### Examples

GET http://localhost:8000/news
GET http://localhost:8000/news/1

POST http://localhost:8000/news
{
 "title": "new note",
 "body": "new body",
 "postImage": "new image"
}

PUT http://localhost:8000/news/2
{
 "title": "edit note",
 "body": "edit body",
 "postImage": "edit image"
}

DELETE http://localhost:8000/news/2

GET http://localhost:8000/newsStream