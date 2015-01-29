var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//app.get('/', function(req, res){
//    res.send('<h1>Welcome Realtime Server</h1>');
//});
app.get('/', function(req, res){
    res.sendfile('views/index.html');
});

//io.on('connection', function(socket){
//    console.log('a user connected');
//
//});
//io.on('connection', function(socket){
//    console.log('a user connected');
//    socket.on('disconnect', function(){
//        console.log('user disconnected');
//    });
//});
//io.on('connection', function(socket){
//    socket.on('chat message', function(msg){
//        console.log('message: ' + msg);
//    });
//});
//io.emit('some event', { for: 'everyone' });
//io.on('connection', function(socket){
//    socket.broadcast.emit('hi');
//
//});
//io.on('connection', function(socket){
//    socket.on('chat message', function(msg){
//        //调用前台的 message 事件
//        io.emit('message', msg);
//    });
//});





    //在线用户
var onlineUser = {};
    //当前在线人数
var onlineCount = 0;

io.on('connection',function(socket){
    //监听新用户加入
    socket.on('login',function(obj){
        //将新加入的唯一标识当作socket的名称，后面退出的时候用到
        socket.name = obj.userid;
        console.log(obj);
        //检查在线列表，如果不在里面就加入
        if(!onlineUser.hasOwnProperty(obj.userid)){
            onlineUser[obj.userid] = obj.username;
            //在线人数+1
            onlineCount++;
        }

        //向所有客户端广播用户加入
        io.emit('login',{onlineUser:onlineUser,onlineCount:onlineCount,user:obj});
        console.log(obj.username+'加入聊天室');
    });

    //监听用户退出
    socket.on('disconnect',function(){
        //将退出的用户从在线列表中删除
        if(onlineUser.hasOwnProperty(socket.name)){
            //退出用户的信息
            var obj = {userid:socket.name,username:onlineUser[socket.name]};

            //删除
            delete onlineUser[socket.name];
            //在线人数 -1
            onlineCount -- ;

            //向客户端广播用户退出
            io.emit('logout',{onlineUser:onlineUser,onlineCount:onlineCount,user:obj});
            console.log(obj.username+'退出了聊天室');
        }

    });

    //监听用户发布聊天内容
    socket.on('message',function(obj){
        console.log('aaaaaaaaaaaaa');
        //向所以客户端广播发布的消息
        io.emit('message',obj);
        console.log(obj.username+'说：'+obj.content);
    });


});



http.listen(3000, function(){
    console.log('listening on *:3000');
});