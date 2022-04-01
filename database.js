const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./db/adobe.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the adobe database.');
});

// db.serialize(() => {
//   db.each(`SELECT PlaylistId as id,
//                   Name as name
//            FROM playlists`, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log(row.id + "\t" + row.name);
//   });
// });


db.all(`SELECT * FROM panel_members;`,[],(err,result) => {
    if (err) {
      // throw err;
      console.log('Some Error Occured');
    } else {
      console.log(result);
      console.log('Table Created');
    }
  });



db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});