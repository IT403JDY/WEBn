var http = require('http'); //import?
var fs = require('fs');
var url = require('url'); //url이라는 모듈을 사용하겠다는 것이고 url이라는 이름으로 사용할 것이다.
var qs = require('querystring');

function templateHTML(title, list, body,control){
    return `
    <!doctype html>
    <html>
    <head><title>WEB2 - ${title}</title><meta charset="utf-8"></head>
    <body><h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}</body>
    </html>
    `;
}
function templateList(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        i=i+1;
    }
    list = list+'</ul>';
    return list
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    if(pathname === '/'){
        if(queryData.id === undefined){ //즉 home일때
            
            fs.readdir('./data', function(error, filelist){
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = templateList(filelist);            
                var template = templateHTML(title,list,`<h2>${title}</h2>${description}`,
                `<a href="/create">create</a>
                `);
                response.writeHead(200); // 200은 파일을 성공적으로 전송하였다.
                response.end(template);
                })

        }else{
                fs.readdir('./data', function(error, filelist){
                    var list = templateList(filelist);
                    fs.readFile(`data/${queryData.id}`,'utf-8', function(err,data){
                        var description = data;
                        var title = queryData.id;
                        var template = templateHTML(title,list,`<h2>${title}</h2>${description}`,`<a href="/create">create</a>
                        <a href="/update?id=${title}">update</a>
                        <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                        </form>
                        `);
                        response.writeHead(200); // 200은 파일을 성공적으로 전송하였다.
                        response.end(template);
                        });
                });     
            }
    }else if(pathname==='/create'){ //get으로 받은 querystring

        fs.readdir('./data', function(error, filelist){
                        var title = 'WEB - create';
                        var list = templateList(filelist);            
                        var template = templateHTML(title,list,`
                            <form action="/create_process" method='post'>
                                <p>
                                    <input type='text' name="title" placeholder="title">
                                </p>
                                <p>
                                    <textarea name="description" placeholder="description"></textarea>
                                </p>
                                <p>
                                    <input type='submit'>
                                </p>        
                            </form>
                        `);
                        response.writeHead(200); // 200은 파일을 성공적으로 전송하였다.
                        response.end(template);
                        });
    }else if(pathname === '/create_process'){ //post 메시지 처리
        //createServer의 콜백함수의 post를 통해 전달된 데이터를 request를 통해 받아들인다.
        var body = '';
        request.on('data', function(data){
            body+=data;
            //if(body.length>1e6){ //만약 데이터가 너무크게 들어오면 끊는 코드 보안적인 부분이다.
            //request.connection.destroy();
            //}
        });
        request.on('end', function(){
            var post = qs.parse(body); //body를 통해 받은 qs의 데이터를 볼 수 있도록 받는다.
            var title = post.title;
            var description = post.description;       
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?=id=${title}`}); //302 : redirection 다른곳으로 연결
                response.end('<h1>success</h1>');
            })
        });
    }else if(pathname === '/update'){
        fs.readdir('./data', function(error, filelist){
            var list = templateList(filelist);
            fs.readFile(`data/${queryData.id}`,'utf-8', function(err,data){
                var description = data;
                var title = queryData.id;
                var template = templateHTML(title,list,`
                <form action="/update_process" method='post'> 
                <input type="hidden" name="id" value="${title}"> <!--현재의 아이디인 ex)css를 밑에서 title이 변경되어도 id값은 유지하기
                위해서 hidden속성을 통해 값을 유지하려한것이다.-->   
                <p>
                        <input type='text' name="title" placeholder="title" value="${title}">
                    </p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type='submit'>
                    </p>        
                </form>
                `,`<a href="/create">create</a>
                <a href="/update?id=${title}">update</a>
                `);
                response.writeHead(200); // 200은 파일을 성공적으로 전송하였다.
                response.end(template);
                });
        });     
    }else if(pathname==='/update_process'){ //post 메시지 처리
        var body = '';
        request.on('data', function(data){
            body+=data;
        });
        request.on('end', function(){
            var post = qs.parse(body); //body를 통해 받은 qs의 데이터를 볼 수 있도록 받는다.
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`,`data/${title}`, function(err){ // rename(old, new, callback)
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?=id=${title}`}); //302 : redirection 다른곳으로 연결
                    response.end('<h1>success</h1>');
                })
            })    
        });
    }else if(pathname==='/delete_process'){ //post 메시지 처리
        var body = '';
        request.on('data', function(data){
            body+=data;
        });
        request.on('end', function(){
            var post = qs.parse(body); //body를 통해 받은 qs의 데이터를 볼 수 있도록 받는다.
            var id = post.id;
            fs.unlink(`data/${id}`,function(err){
                response.writeHead(302, {Location: `/`});
                response.end();
            })
        });
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
