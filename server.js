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
    // console.log(result);
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



app.get('/add_interview', function (req, res) {
  db.all(`SELECT * FROM panel_members;`,[],(err,result1,field) => {
    if(err) throw err;
    // console.log(result1);
    db.all('SELECT * FROM  month;',[], (err,result2,field) => {
      if(err) throw err;
        console.log(result2[0].val);
        let month=result2[0].val;
        let month2=month;
        month=month.replace('-','_');
        console.log(month);
        const tableColumns = [];
      const columns = ["month_"+month+"_a", "month_"+month+"_d"];
      // console.log(columns);
      db.all(`PRAGMA table_info(panel_members);`, [],(err,result,field) => {
        if(err) throw err; 

        // console.log(result)
        
        result.forEach(i => {
          tableColumns.push(i.name);
        });
      // console.log(tableColumns);
      columns.forEach(col => {
        if(!tableColumns.includes(col)){
          db.all(`ALTER TABLE panel_members ADD ${col} int DEFAULT 0;`,[], (err,result,field) => {
            if(err) throw err;  
          });
        }
        });
        let month_name=['January','Feburary','March','April','May','June','July','August','September','October','November','December'];
      let month_num=month.substring(5,7);

      return res.render('interview.ejs', {details:result1, months:columns,current_month:Number(month_num)-1, val:month2});
    });
    
  });
});
});



app.post('/add_interview',(req,res)=>{
  let date=req.body.date;
  let empid=req.body.empid;
  

  date=date.substring(0,4)+'_'+date.substring(5,7)+'_'+date.substring(8,10);
  // console.log(date);
  const tableColumns = []
  const newtableColumns = []

  const columns = ["day_"+date+"_a", "day_"+date+"_d", "month_"+date.substring(0, 7)+"_a", "month_"+date.substring(0, 7)+"_d"]
  // console.log(columns);

  db.all(`PRAGMA table_info(panel_members);`,[], (err,result,field) => {
    if(err) throw err; 
    
    result.forEach(i => {
      tableColumns.push(i.name);
    });
  
    columns.forEach(col => {
      if(tableColumns.includes(col)){
        // console.log("already existed");
      }
      else{
        // console.log("adding column");
        db.run(`ALTER TABLE panel_members ADD ${col} int DEFAULT 0;`,(err) => {
          if(err) throw err;  
          // console.log(result);
        });
      }
    });

    // console.log(columns);
    // console.log(tableColumns);
    if(req.body.hasOwnProperty("add")){
      db.all(`UPDATE panel_members SET ${columns[0]}=${columns[0]}+1, ${columns[2]}=${columns[2]}+1 where emp_id=${empid};`,[], (err,result,field) => {
        if(err) throw err; 
        res.redirect('/add_interview');
      });
    }
    else{
      db.all(`UPDATE panel_members SET ${columns[0]}=${columns[0]}-1, ${columns[2]}=${columns[2]}-1, ${columns[1]}=${columns[1]}+1, ${columns[3]}=${columns[3]}+1 where emp_id=${empid};`,[], (err,result,field) => {
        if(err) throw err; 
        res.redirect('/add_interview');
      });
    }
  });
});




app.post('/date',(req,res)=>{
  let month=req.body.month;
  // console.log(month);
  db.all(`UPDATE month SET val='${month}' where id=1 ;`,[], (err,result,field) => {
    if(err) throw err;
    res.redirect('/add_interview');
  });

});

app.listen(port, () => console.log(`This app is listening on http://${hostname}:${port}`));