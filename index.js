const express = require("express");
const session = require('express-session');
const path = require("path");
const { Pool } = require("pg");
const fs = require("fs");
const fileUpload = require('express-fileupload');
// Creating the Express server
const app = express();
const crypto = require('crypto');

app.use(fileUpload());
/* const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, function (req, res) {
}).listen(3001); */

const connectionString = 'postgresql://yoda:h5cVMx48QWZkWYf32s6_ow@free-tier13.aws-eu-central-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dyc-40-bdd-3058'
const pool = new Pool({
  connectionString,
});

app.use(session({
    key: 'user_sid',
    secret: 'cac40',
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

const imgreco = "SELECT image,imagename FROM image"
pool.query(imgreco, [], (err, rows) => {
	if (err) {
		return console.error(err.message);
	}
	rows.rows.forEach((row) => {
		fs.writeFile('./public/image/' + row.imagename, row.image, 'ascii', function(err) {
			if (err) {
				return console.error(err.message);
			}
		});
	});
});

app.get("/actu", (req, res) => {
	const sql = "SELECT cast(date AS TEXT),title,actuid,imagename FROM actu order by date desc"
	pool.query(sql, [], (err, rows) => {
		if (err) {
			return console.error(err.message);
		}
		rows.rows.forEach((row) => {
			var sep ="-";
			var temp1 = row.date.split('-');
			row.date=temp1[2]+sep+temp1[1]+sep+temp1[0]
		});
		res.render("actu", {model:rows.rows ,req:req});
	});
});

app.get("/", (req, res) => {
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

app.get("/sponsor", (req, res) => {
	res.render("sponsor",{req:req});
});

app.post("/login", (req, res) => {
	const sql = "SELECT * from utilisateur where (nickname=$1 or email=$2) and password=$3";
	var pass=crypto.createHash('md5').update(req.body.password).digest("hex");
	const user = [req.body.nickname,req.body.nickname,pass];
	pool.query(sql, user,(err ,rows )=> {
		if (err) {
			return console.error(err.message);
		}
		if(rows.rows[0]!=null){
			req.session.isLoggedIn = true;
			req.session.nickname = rows.rows[0].nickname;
			req.session.key= rows.rows[0].userid;
			req.session.admin=rows.rows[0].admin;
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
  const sql = "INSERT INTO utilisateur(userid,email, nickname,password,admin) VALUES(default,$1,$2,$3,0)";
  var pass=crypto.createHash('md5').update(req.body.password).digest("hex");
  const user = [req.body.email, req.body.nickname,pass];
  pool.query(sql, user, err => {
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
				const sql = "INSERT INTO actu (title, content,author,authorid,videolink) VALUES ($1,$2,$3,$4,$5)";
				const user = [req.body.title, req.body.content,req.session.nickname,req.session.key,req.body.lien];
				pool.query(sql, user, err => {
					if (err) {
						return console.error(err.message);
					}
					res.redirect('/actu');
				});
			} else {
				let picture = req.files.picture;
				picture.mv('./public/image/' + picture.name);
				const sql = "INSERT INTO actu (title, content,author,authorid,imagename,videolink) VALUES ($1,$2,$3,$4,$5,$6)";
				const user = [req.body.title, req.body.content,req.session.nickname,req.session.key,picture.name,req.body.lien];
				pool.query(sql, user, err => {
					if (err) {
						return console.error(err.message);
					}
					const sql2 = "INSERT INTO image (image,imagename) VALUES ($1,$2)";
					const user2 = [picture.data,picture.name];
					pool.query(sql2, user2, err => {
						if (err) {
							return console.error(err.message);
						}
					});
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

app.get("/article/:id", (req, res) => {
	const sql1 = "SELECT actuid,title,content,author,authorid,imagename,cast(date AS TEXT),videolink FROM actu where actuid=$1"
	const actu1 = [req.params.id];
	pool.query(sql1, actu1, (err, rows1) => {
		if (err) {
			return console.error(err.message);
		}
		rows1.rows.forEach((row) => {
			var sep ="-";
			var temp1 = row.date.split('-');
			row.date=temp1[2]+sep+temp1[1]+sep+temp1[0]
		});
		if(rows1){
			const sql2 = "SELECT answerid,actuid,content,author,authorid,cast(date AS TEXT) FROM answer where actuid=$1 ORDER BY answerid desc"
			pool.query(sql2, actu1, (err, rows2) => {
				if (err) {
					return console.error(err.message);
				}
				rows2.rows.forEach((row) => {
					var sep ="-";
					var temp1 = row.date.split('-');
					row.date=temp1[2]+sep+temp1[1]+sep+temp1[0]
				});
				res.render("article",{actu:[rows1.rows[0],rows2.rows] ,req:req})
			});
		}else{
			res.redirect('/actu');
		}
	});
});

app.get("/edit/:id",sessionChecker, (req, res) => {
	if(req.session.admin){
		const sql1 = "SELECT * FROM actu where actuid=$1"
		const actu1 = [req.params.id];
		pool.query(sql1, actu1, (err, rows) => {
			if (err) {
				return console.error(err.message);
			}
			res.render("edit",{actu:rows.rows[0] ,req:req})
		});
	}
	else{
		redirect('/actu');
	}
});

app.post("/edit/:id",sessionChecker, (req, res) => {
	if(req.session.admin){
		if(!req.files) {
			const sql = "UPDATE actu SET title=$1 , content=$2 , videolink=$3 WHERE actuid=$4";
			const user = [req.body.title, req.body.content,req.body.lien,req.params.id];
			pool.query(sql, user, err => {
				if (err) {
					return console.error(err.message);
				}
			});
		} else {
			let picture = req.files.picture;
			picture.mv('./public/image/' + picture.name);
			const sql = "UPDATE actu SET title=$1 , content=$2 , videolink=$3 , imagename=$4 WHERE actuid=$5";
			const user = [req.body.title, req.body.content,req.body.lien,picture.name,req.params.id];
			pool.query(sql, user, err => {
				if (err) {
					return console.error(err.message);
				}
				const sql2 = "INSERT INTO image (image,imagename) VALUES ($1,$2)";
				const user2 = [picture.data,picture.name];
				pool.query(sql2, user2, err => {
					if (err) {
						return console.error(err.message);
					}
				});
			});
		};
		res.redirect('/actu')
	}
	else{
		res.redirect('/actu')
	}
});

app.get("/delete/:id",sessionChecker, (req, res) => {
	if(req.session.admin){
		const sql1 = "DELETE FROM actu WHERE actuid=$1";
		const actu1 = [req.params.id];
		pool.query(sql1, actu1, (err, rows) => {
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
		const sql = "INSERT INTO answer (content,author,authorid,actuid) VALUES ($1,$2,$3,$4)";
		const user = [req.body.comment,req.session.nickname,req.session.key,req.params.id];
		pool.query(sql, user, err => {
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
		const sql1 = "SELECT * FROM answer where actuid=?"
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
		const sql1 = "UPDATE answer SET title=? , content=? WHERE actuid=?";
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

app.get("/deletea/:articleid/:andwerid",sessionChecker, (req, res) => {
	if(req.session.isLoggedIn){
		const sql1 = "DELETE FROM answer WHERE answerid=$1";
		const actu1 = [req.params.andwerid];
		pool.query(sql1, actu1, (err, rows) => {
			if (err) {
			  return console.error(err.message);
			}
		});
		res.redirect('/article/'+req.params.articleid)
	}
	else{
		res.redirect('/article/'+req.params.articleid)
	}
});

app.use(function (req, res, next) {
	//improve this
	res.status(404).render("404",{req:req});;
});