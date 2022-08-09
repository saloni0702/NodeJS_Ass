let http = require('http')
let fs = require('fs')
fs.writeFileSync('index.html',"<h1>Hello World</h1><p>This is Saloni Patel</p>")

fs.readFile('./index.html',(err,data)=>{
	http.createServer((req,res)=>{
	res.writeHead(200,{"Content-Type":"text/html"});
	res.write(data);
	res.end();
	}).listen(5000);

}) 