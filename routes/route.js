var express = require('express');
var router = express.Router();

const {check, validationResult} = require('express-validator');
const { route } = require('../app');

const db = require('./../db');

router.get('/', (req, res) => {
  db.getAllNotice((rows) => {
    res.render('notice', { rows : rows })
  })
})

router.get('/notice_write', (req, res) => {
  res.render('notice_write')
})

// router.get('/notice_full', (req, res) => {
//   res.render('notice_full')
// })

router.post('/store', check('NTC_title').isLength({min: 1, max: 300}),
  function (req, res, next) {
    let errs = validationResult(req);
    console.log(errs);
    if (errs['errors'].length > 0) {
      res.render('notice_write',{errs: errs['errors']});
    } else {      
      let param = JSON.parse(JSON.stringify(req.body));
      let N_title = param['NTC_title'];
      let N_name = param['NTC_name'];
      let N_date = param['NTC_date'];
      let N_detail = param['NTC_detail'];
      db.insertNotice(N_title, N_name, N_date, N_detail, function() {
        res.redirect('/');
      })
    }
  }
)

router.get('/notice_full', (req, res) =>{
  let num = req.query.num;

  db.getNoticeById(num, (row)=>{
    if(typeof num === 'undefinde' || row.length <= 0){
      res.status(404).json({error:'undefinde notice'});
    }else{
      res.render('notice_full',{row:row[0]});
    }
  });
});

router.post('/notice_full', [check('NTC_title').isLength({ min: 1, max: 500 })],
(req, res) => {
let errs = validationResult(req);

let param = JSON.parse(JSON.stringify(req.body));
let N_num = param['num'];
let N_title = param['title'];

if(errs['errors'].length > 0){ //화면에 에러 출력하기 위함

  db.getNoticeById(id, (row)=>{ //유효성 검사에 적합하지 않으면 정보를 다시 조회 후, updateMemo 페이지를 다시 랜더링한다.
    res.render('notice_full',{row:row[0], errs:errs['errors']});
  });
}else{
  db.updateNoticeById(N_num, N_title, () =>{
    res.redirect('/');
  });
}
});

router.get('/deleteNotice', (req, res) =>{
  let id = req.query.id;
  db.deleteNoticeById(id, () =>{
    res.redirect('/');
  });
});

module.exports = router;