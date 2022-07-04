const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  port: 3306,
  database: 'notice',
  dateStrings: 'date' // 날짜 시간 출력
})

// 리스트 전체를 불러오는 함수
function getAllNotice(callback) {
  connection.query('SELECT * FROM notice ORDER BY num DESC', (err, rows, fields) => {
    if(err) throw err;
    callback(rows);
  })
}

// 리스트에 새로운 내용을 추가하는 함수
function insertNotice(title, name, date, detail, callback) {
  connection.query(`INSERT INTO notice(title, name, date, detail) VALUES('${title}','${name}','${date}', '${detail}')`, (err, result) => {
    if(err) throw err;
    callback();
  })
}

// 리스트 중 id값이 일치하는 row만 불러오는 함수
function getNoticeById(num, callback) {
  connection.query(`SELECT * FROM notice WHERE num = ${num}`, (err, row, fields) => {
    if(err) throw err;
    callback(row);
  })
}

// 리스트 중 id값이 일치하는 부분을 수정하는 함수
function updateNoticeById(num, title , name, date, detail, file, callback){
  connection.query(`UPDATE notice SET title='${title}', name='${name}', date='${date}', detail='${detail}', file='${file}' WHERE num='${num}'`, (err, result) => {
      if(err) throw err;
      callback();
  });
}

// 리스트 중 id값이 일치하는 부분을 삭제하는 함수
function deleteNoticeById(num, callback) {
  connection.query(`DELETE FROM notice WHERE num = ${num}`, (err, fields) => {
    if(err) throw err;
    callback();
  })
}

module.exports = {
  getAllNotice,
  insertNotice,
  getNoticeById,
  updateNoticeById,
  deleteNoticeById
}