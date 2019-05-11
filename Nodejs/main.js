var http = require('http'); //import?
var fs = require('fs');
var url = require('url'); //url이라는 모듈을 사용하겠다는 것이고 url이라는 이름으로 사용할 것이다.

function templateHTML(title, list, body){
    return `
    <!doctype html>
    <html>
    <head><title>WEB1 - ${title}</title><meta charset="utf-8"></head>
    <body><h1><a href="/">WEB</a></h1>${list}${body}</body>
    </html>
    `;
}
function templateList(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
        list = list + `<li><a href="/?id=">${filelist[i]}</a></li>`
        i=i+1;
    }
    list = list+'</ul>';
    return list
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    
    if(pathname === '/'){
        if(queryData.id === undefined){ //즉 home일때
            
            fs.readdir('./data', function(error, filelist){
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = templateList(filelist);            
                var template = templateHTML(title,list,`<h2>${title}</h2>${description}`);
                response.writeHead(200); // 200은 파일을 성공적으로 전송하였다.
                response.end(template);
                })

        }else{
                fs.readdir('./data', function(error, filelist){
                    var list = templateList(filelist);            
                    fs.readFile(`data/${queryData.id}`,'utf-8', function(err,data){
                        var description = data;
                        var title = queryData.id;
                        var template = templateHTML(title,list,`<h2>${title}</h2>${description}`);
                        response.writeHead(200); // 200은 파일을 성공적으로 전송하였다.
                        response.end(template);
                        });
                });     
            }
    }else{
        response.writeHead(404); // 404파일을 찾을 수가 없다.
        response.end('Not Found');
    }
});
app.listen(3000);

//URL : 자료의 위치
//http://opentutorials.org:3000/main?id=HTML&page=12
//프로토콜://host(domain):포트번호/path?query string
//domain = 인터넷에 접속되어있는 컴퓨터의 주소
//포트번호 = 한 컴퓨터안에 많은 서버가 존재할 수 있다. 
//path = 파일 주소
//query string = 여기를 변경하면 웹서버에 어떠한 데이터를 전달할 수 있다.

//정보시스템의 핵심 메커니즘 = CRUD(Create Read Update Delete)
//입력 파라미터(입력되는 정보의 형식) 알규먼트(파라마터에 따라 입력한 값)
