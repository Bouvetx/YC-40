const express = require("express");
//const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fileUpload = require('express-fileupload');
// Creating the Express server
const app = express();
const crypto = require('crypto');

//app.use(cookieParser());
app.use(fileUpload());
/* const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, function (req, res) {
}).listen(3001); */

app.use(session({
    key: 'user_sid',
    secret: 'AbC',
    resave: false,
    saveUninitialized: false,
	nickname: "",
    cookie: {
        expires: 86400000
    }
}));

const sessionChecker = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/');
    } else {
        next();
    }    
};



const db_name = path.join(__dirname, "data", "YC40.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'YC40.db'");
});

/*
const sql_debug1 = `DROP table faq;`;
db.run(sql_debug1, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Drop faq");
});

const sql_debug2 = `DROP table user;`;

db.run(sql_debug2, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Drop user");
});
/*
const sql_debug3 = "SELECT * from user";
db.all(sql_debug3, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.email);
	console.log(row.nickname);
	console.log(row.password);
	console.log();
  });
});
*/

const sql_create_db_user = `CREATE TABLE IF NOT EXISTS user (
  userId INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  nickname TEXT NOT NULL,
  password TEXT NOT NULL,
  admin BIT NOT NULL
);`;

db.run(sql_create_db_user, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'user' table");
});

const sql_create_db_actu = `CREATE TABLE IF NOT EXISTS actu (
  actuId INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  authorid TEXT NOT NULL,
  image TEXT default "default.jpg",
  date TEXT default current_timestamp
);`;

db.run(sql_create_db_actu, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'actu' table");
});

const sql_create_db_answer = `CREATE TABLE IF NOT EXISTS answer (
  answerId INTEGER PRIMARY KEY AUTOINCREMENT,
  actuId INTEGER NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  authorId TEXT NOT NULL,
  votes TEXT DEFAULT "",
  votesnb INTEGER DEFAULT 0,
  date TEXT default current_timestamp
);`;

db.run(sql_create_db_answer, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'answer' table");
});

// Server configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false })); // <--- middleware configuration



// Starting the server
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);



/* app.get('/', (req, res) => {
    if (true) {
		const sql = "SELECT * FROM actu order by actuId desc"
		  db.all(sql, [], (err, rows) => {
			if (err) {
			  return console.error(err.message);
			}
			res.render("index", { model: rows ,req:req});
		  });
    } else {
        res.redirect('/login');
    }
}); */

app.get("/actu", (req, res) => {
	const sql = "SELECT date(date) as ddate,title,actuId,image FROM actu order by actuId desc"
		  db.all(sql, [], (err, rows) => {
			if (err) {
			  return console.error(err.message);
			}
			res.render("actu", {model:rows ,req:req});
		  });
});

app.get("/", (req, res) => {
	//console.log(req.session);
	res.render("home",{req:req});
});

app.get("/login", (req, res) => {
	res.render("login",{req:req});
});

app.get("/home", (req, res) => {
	res.render("home",{req:req});
});

app.get("/bateau", (req, res) => {
	res.render("bateau",{req:req});
});

app.get("/skipper", (req, res) => {
	res.render("skipper",{req:req});
});

app.get("/course", (req, res) => {
	res.render("course",{req:req});
});

app.post("/login", (req, res) => {
	const sql = "SELECT * from user where (nickname=? or email=?) and password=?";
	var pass=crypto.createHash('md5').update(req.body.password).digest("hex");
	const user = [req.body.nickname,req.body.nickname,pass];
	db.all(sql, user,(err ,rows )=> {
		if (err) {
			return console.error(err.message);
		}
		if(rows[0]!=null){
			req.session.isLoggedIn = true;
			req.session.nickname = rows[0].nickname;
			req.session.key= rows[0].userId;
			req.session.admin=rows[0].admin;
			res.redirect("/");
		}
		else{
			res.redirect("/login");
		}
	});
});

app.get("/signup", (req, res) => {
  res.render("signup",{req:req});
});

app.get("/logout",sessionChecker, (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.post("/signup", (req, res) => {
  //verifie si l'user exist
  const sql = "INSERT INTO user (email, nickname,password,admin) VALUES (?,?,?,0)";
  var pass=crypto.createHash('md5').update(req.body.password).digest("hex");
  const user = [req.body.email, req.body.nickname,pass];
  db.run(sql, user, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect('/login');
  });
});

app.get("/newactu",sessionChecker, (req, res) => {
	if (req.session.admin) {
		res.render("newactu",{req:req});
    } else {
        res.redirect('/actu');
    }
});

app.post("/newactu",sessionChecker, (req, res) => {
	if(req.session.admin){
		try {
			if(!req.files) {
				const sql = "INSERT INTO actu (title, content,author,authorId) VALUES (?,?,?,?)";
				const user = [req.body.title, req.body.content,req.session.nickname,req.session.key];
				db.run(sql, user, err => {
					if (err) {
						return console.error(err.message);
					}
					res.redirect('/actu');
				});
			} else {
				//Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
				let picture = req.files.picture;
				
				//Use the mv() method to place the file in upload directory (i.e. "uploads")
				picture.mv('./public/image/' + picture.name);
				const sql = "INSERT INTO actu (title, content,author,authorId,image) VALUES (?,?,?,?,?)";
				const user = [req.body.title, req.body.content,req.session.nickname,req.session.key,req.files.picture.name];
				db.run(sql, user, err => {
					if (err) {
						return console.error(err.message);
					}
					res.redirect('/actu');
				});
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}
	else{
		res.redirect('/actu');
	}
});

app.post('/upload-avatar', async (req, res) => {
    
});

app.get("/article/:id", (req, res) => {
	const sql1 = "SELECT * FROM actu where actuId=?"
	const actu1 = [req.params.id];
	db.get(sql1, actu1, (err, rows1) => {
		if (err) {
			return console.error(err.message);
		}
		if(rows1){
			const sql2 = "SELECT * FROM answer where actuId=? ORDER BY answerId desc"
			db.all(sql2, actu1, (err, rows2) => {
				if (err) {
					return console.error(err.message);
				}
				res.render("article",{actu:[rows1,rows2] ,req:req})
			});
		}else{
			res.redirect('/actu');
		}
	});
});

app.get("/edit/:id",sessionChecker, (req, res) => {
	if(req.session.admin){
		const sql1 = "SELECT * FROM actu where actuId=?"
	const actu1 = [req.params.id];
	db.all(sql1, actu1, (err, rows) => {
		if (err) {
			return console.error(err.message);
		}
		res.render("edit",{actu:rows[0] ,req:req})
	});
	}
	else{
		redirect('/actu');
	}
});

app.post("/edit/:id",sessionChecker, (req, res) => {
	if(req.session.admin){
		const sql1 = "UPDATE actu SET title=? , content=? WHERE actuId=?";
		const actu1 = [req.body.title,req.body.content,req.params.id];
		db.run(sql1, actu1, (err, rows) => {
			if (err) {
			  return console.error(err.message);
			}
		});
		res.redirect('/actu')
	}
	else{
		res.redirect('/actu')
	}
});

app.get("/delete/:id",sessionChecker, (req, res) => {
	if(req.session.admin){
		const sql1 = "DELETE FROM actu WHERE actuId=?";
		const actu1 = [req.params.id];
		db.run(sql1, actu1, (err, rows) => {
			if (err) {
			  return console.error(err.message);
			}
		});
		res.redirect('/actu')
	}
	else{
		res.redirect('/actu')
	}
});

app.post("/newanswer/:id", (req, res) => {
	if(req.session.isLoggedIn){
		const sql = "INSERT INTO answer (content,author,authorId,actuId) VALUES (?,?,?,?)";
		const user = [req.body.comment,req.session.nickname,req.session.key,req.params.id];
		db.run(sql, user, err => {
			if (err) {
				return console.error(err.message);
			}
			res.redirect('/article/'+req.params.id);
		});
	}
	else{
		res.redirect('/login');
	}
});

/* Rendering page with only the selected comment editable
app.get("/edita/:id",sessionChecker, (req, res) => {
	if(req.session.admin){
		const sql1 = "SELECT * FROM answer where actuId=?"
	const actu1 = [req.params.id];
	db.all(sql1, actu1, (err, rows) => {
		if (err) {
			return console.error(err.message);
		}
		res.render("edit",{actu:rows[0] ,req:req})
	});
	}
	else{
		redirect('/actu');
	}
});

app.post("/edita/:id",sessionChecker, (req, res) => {
	if(req.session.admin){
		const sql1 = "UPDATE answer SET title=? , content=? WHERE actuId=?";
		const actu1 = [req.body.title,req.body.content,req.params.id];
		db.all(sql1, actu1, (err, rows) => {
			if (err) {
			  throw err;
			}
		});
		res.redirect('/actu')
	}
	else{
		res.redirect('/actu')
	}
});
*/

app.get("/deletea/:articleId/:andwerId",sessionChecker, (req, res) => {
	if(req.session.isLoggedIn){
		const sql1 = "DELETE FROM answer WHERE answerId=?";
		const actu1 = [req.params.andwerId];
		db.run(sql1, actu1, (err, rows) => {
			if (err) {
			  return console.error(err.message);
			}
		});
		res.redirect('/article/'+req.params.articleId)
	}
	else{
		res.redirect('/article/'+req.params.articleId)
	}
});

app.use(function (req, res, next) {
	//improve this
	res.status(404).render("404",{req:req});;
});