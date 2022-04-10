var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `;
}
function templateList(fileList){
  var list = '<ul>';
  var i = 0;
  while(i < fileList.length){
    list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/'){
      if(queryData.id === undefined){

        fs.readdir('./data', function(error, fileList){
          var title = 'Welcome';
          var description = 'Hello Nodejs';
          var list = templateList(fileList);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(template);
        });

      } else {
        fs.readdir('./data', function(error, fileList){
          fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
            var title = queryData.id;
            var list = templateList(fileList);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, fileList){
        var title = 'WEB - create';
        var list = templateList(fileList);
        var template = templateHTML(title, list, `
          <form action="http://localhost:3000/create_process" method="post">
              <p><input text="text" placeholder="title"></p>
              <p>
                  <textarea placeholder="description"></textarea>
              </p>
              <p>
                  <input type="submit">
              </p>
          </form>
        `);
        response.writeHead(200);
        response.end(template);
      });
    } else if (pathname === '/create_process') {
      var body ='';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var tilte = post.title;
          var description = post.description;
      });
      response.writeHead(200);
      response.end('success');
    } else {
      response.writeHead(404);
      response.end('Not found');
    }

 
});
app.listen(3000);