var fs = require('fs');
 
var data = 'fs.writeFile test';
 
fs.writeFile('text.txt', data, 'utf8', function(err) {
    console.log('비동기적 파일 쓰기 완료');
});
 
 
fs.writeFileSync('text.txt', data, 'utf8');
console.log('동기적 파일 쓰기 완료');

try {
	var data = fs.readFileSync('text.txt', 'utf8'); // 비동기적 예외처리
	console.log(data);
} catch (err) {
    console.log(err);
}

try {
	var data = fs.readFileSync('text.txt', 'utf8'); // 비동기적 예외처리
	console.log("동기적 읽기" + data);
} catch (err) {
    console.log(err);
}