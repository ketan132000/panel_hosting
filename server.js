const express = require('express');
const app = express(); 
const ejs = require('ejs');

const hostname='localhost';
const port = process.env.PORT || 5000;


const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./db/adobe.db', sqlite3.OPEN_READWRITE, (err,result,field) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the adobe database.');
});




app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
  });

app.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username,password);
    if(username=="ketanchawla2000@gmail.com" && password=="mN2bFn@1"){
       res.redirect('/ketan');
    }
    res.sendFile(__dirname + '/static/invalid.html');
    
});

app.get('/ketan',(req,res)=>{
  res.render('dashboard.ejs', {});
});


app.get('/excel', function (req, res) {
  console.log(req.body)
  db.all(`SELECT * FROM panel_members;`,[],(err,result,field) => {
    if(err) throw err;
    console.log(result);
    res.render('excel.ejs', {details:result});
  });
});
 

app.get('/edit',(req,res)=>{
  let empid=req.query.emp_id;

  db.all(`SELECT * FROM panel_members WHERE emp_id=${empid};`,[],(err,result,field) => {
    if(err) throw err;
    res.render('edit.ejs', {details:result[0]});
    });
});


app.post('/edit',(req,res)=>{
  let empid=req.body.empid
  let empname=req.body.name;
  let jobcode=req.body.job_code;
  let rm=req.body.rm;
  let ready=req.body.ready;
  let java=req.body.java;
  let cpp=req.body.cpp;

  db.all(`UPDATE panel_members SET emp_name="${empname}", job_code="${jobcode}", rm="${rm}", ready="${ready}", java="${java}", cpp="${cpp}" WHERE emp_id=${empid};`,[], (err,result,field) => {
    if(err) throw err;
    res.redirect('/excel')
  });

});

app.get('/delete',(req,res)=>{
  let empid=req.query.emp_id;
  db.all(`Delete FROM panel_members WHERE emp_id=${empid};`,[], (err,result,field) => {
    if(err) throw err;
    res.redirect('/excel')
  });
});


app.get('/add',(req,res)=>{
  res.sendFile(__dirname + '/static/add.html');
});


app.post('/add',(req,res)=>{
  let empid=req.body.empid
  let empname=req.body.name;
  let jobcode=req.body.job_code;
  let rm=req.body.rm;
  let ready=req.body.ready;
  let java=req.body.java;
  let cpp=req.body.cpp;
  
  console.log(empid);

    db.all(`INSERT INTO panel_members(emp_id,emp_name,job_code,rm,ready,java,cpp) VALUES (${empid},'${empname}','${jobcode}','${rm}','${ready}','${java}','${cpp}');`, [],(err,result,field) => {
    if(err) throw err;  
    res.redirect('/excel')
  });

});

app.listen(port, () => console.log(`This app is listening on http://${hostname}:${port}`));