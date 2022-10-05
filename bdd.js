const express = require("express");
const session = require('express-session');
const path = require("path");
const { Pool } = require("pg");
// Creating the Express server
const app = express();
const crypto = require('crypto');
//--------------------=YC40 start=--------------------
/*
const pool = new Pool({
  user: 'yoda',
  host: 'free-tier13.aws-eu-central-1.cockroachlabs.cloud',
  database: 'defaultdb',
  password: 'h5cVMx48QWZkWYf32s6_ow',
  port: 26257,
});
*/

const connectionString = 'postgresql://yoda:h5cVMx48QWZkWYf32s6_ow@free-tier13.aws-eu-central-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dyc-40-bdd-3058'
const pool = new Pool({
  connectionString,
});

//--------------------=YC40 end=--------------------
	/*
	const sql_debug_misc_1 = `set DATESTYLE to  ISO;`;
	pool.query(sql_debug_misc_1, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Set date DD/MM/YYYY");
	});
	*/
	/*
	const sql_debug_misc_2 = "SELECT cast(date AS TEXT),title,actuid,image FROM actu order by actuid desc"
	pool.query(sql_debug_misc_2, [], (err, rows) => {
		if (err) {
			return console.error(err.message);
		}
		rows.rows.forEach((row) => {
			console.log("Row is ");
			console.log(row.date);
			var sep ="-";
			var temp1 = row.date.split('-');
			row.date=temp1[2]+sep+temp1[1]+sep+temp1[0]
		});
		console.log("==================")
		console.log(rows.rows);
		//res.render("actu", {model:rows.rows ,req:req});
	});
	*/
	/*
	const sql_debug_misc_3 = "SELECT cast(current_date AS TEXT);"
	pool.query(sql_debug_misc_3, [], (err, rows) => {
		if (err) {
			return console.error(err.message);
		}
		console.log(rows.rows);
	});
	*/
//========================================-Drop table start-========================================
	//--------------------=Users end=--------------------
	/*
	const sql_debug_drop_1 = `DROP table IF EXISTS utilisateur;`;
	pool.query(sql_debug_drop_1, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Drop user");
	});
	*/
	//--------------------=Users end=--------------------
	//--------------------=Actu start=--------------------
	/*
	const sql_debug_drop_2 = `DROP table IF EXISTS actu;`;
	pool.query(sql_debug_drop_2, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Drop actu");
	});
	
	//--------------------=Actu end=--------------------
	//--------------------=Answer start=--------------------
	
	const sql_debug_drop_3 = `DROP table IF EXISTS answer;`;
	pool.query(sql_debug_drop_3, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Drop answer");
	});
	*/
	//--------------------=Answer end=--------------------
	//--------------------=ActuA start=--------------------
	/*
	const sql_debug_drop_4 = `DROP table actuA;`;
	pool.query(sql_debug_drop_4, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Drop actuA");
	});
	*/
	//--------------------=ActuA end=--------------------
	//--------------------=image start=--------------------
	/*
	const sql_debug_drop_5 = `DROP table IF EXISTS image;`;
	pool.query(sql_debug_drop_5, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Drop image");
	});
	*/
	//--------------------=Answer end=--------------------
//========================================-Drop table end-========================================
//========================================-Create table start-========================================
	//--------------------=Users start=--------------------
	/*
	const sql_create_db_user = `CREATE TABLE IF NOT EXISTS utilisateur (
	  userId SERIAL PRIMARY KEY,
	  email VARCHAR(30) NOT NULL,
	  nickname VARCHAR(30) NOT NULL,
	  password VARCHAR(40) NOT NULL,
	  admin INT NOT NULL
	);`;

	pool.query(sql_create_db_user, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Successful creation of the 'user' table");
	});
	*/
	//--------------------=Users start=--------------------
	//--------------------=Actu start=--------------------
	/*
	const sql_create_db_actu = `CREATE TABLE IF NOT EXISTS actu (
	  actuId SERIAL PRIMARY KEY,
	  title VARCHAR(30) NOT NULL,
	  content TEXT NOT NULL,
	  author VARCHAR(30) NOT NULL,
	  authorId VARCHAR(30) NOT NULL,
	  imageName VARCHAR(30) default 'default.jpg',
	  videoLink VARCHAR(50),
	  date DATE default CURRENT_DATE
	);`;
	
	pool.query(sql_create_db_actu, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Successful creation of the 'actu' table");
	});
	
	//--------------------=Actu end=--------------------
	//--------------------=Answer start=--------------------
	
	const sql_create_db_answer = `CREATE TABLE IF NOT EXISTS answer (
	  answerId SERIAL PRIMARY KEY,
	  actuId INTEGER NOT NULL,
	  content TEXT NOT NULL,
	  author VARCHAR(30) NOT NULL,
	  authorId VARCHAR(30) NOT NULL,
	  date DATE default CURRENT_DATE
	);`;

	pool.query(sql_create_db_answer, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Successful creation of the 'answer' table");
	});
	
	//--------------------=Answer end=--------------------
	//--------------------=image start=--------------------
	
	const sql_create_db_image = `CREATE TABLE IF NOT EXISTS image (
	  imageName VARCHAR(30) PRIMARY KEY,
	  image BYTEA
	);`;

	pool.query(sql_create_db_image, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Successful creation of the 'image' table");
	});
	*/
	//--------------------=image end=--------------------
//========================================-Create table end-========================================
//========================================-Select start-========================================
	//--------------------=Users start=--------------------
	/*
	const sql_debug_select_1 = "SELECT * from utilisateur";
	pool.query(sql_debug_select_1, [], (err, rows) => {
	  if (err) {
		return console.error(err.message);
	  }
	  rows.rows.forEach((row) => {
		console.log();
		console.log("userId \t"+row.userid);
		console.log("email \t"+row.email);
		console.log("name \t"+row.nickname);
		console.log("hash \t"+row.password);
		console.log("admin \t"+row.admin);
		console.log();
	  });
	});
	*/
	//--------------------=Users end=--------------------
	//--------------------=Actu start=--------------------
	
	const sql_debug_select_2 = "SELECT * FROM actu"
	pool.query(sql_debug_select_2, [], (err, rows) => {
		if (err) {
			return console.error(err.message);
		}
		rows.rows.forEach((row) => {
			console.log();
			console.log("actuId \t"+row.actuid);
			console.log("title \t"+row.title);
			console.log("content \t"+row.content);
			console.log("authorId \t"+row.authorid);
			console.log("author \t"+row.author);
			console.log("date \t"+row.date);
			console.log("imageName \t"+row.imagename);
			console.log("videoLink \t"+row.videolink);
			console.log();
		});
	});
	
	//--------------------=Actu end=--------------------
	//--------------------=image start=--------------------
	/*
	const sql_debug_select_2 = "SELECT * FROM image"
	pool.query(sql_debug_select_2, [], (err, rows) => {
		if (err) {
			return console.error(err.message);
		}
		rows.rows.forEach((row) => {
			console.log();
			console.log("imagename \t"+row.imagename);
			console.log();
		});
	});
	*/
	//--------------------=image end=--------------------
	//--------------------=Admin start=--------------------
	/*
	const sql_debug_select_3 = "SELECT * from utilisateur";
	pool.query(sql_debug_select_3, [], (err, rows) => {
	  if (err) {
		return console.error(err.message);
	  }
	  rows.rows.forEach((row) => {
		console.log();
		console.log("userId \t"+row.userid);
		console.log("email \t"+row.email);
		console.log("name \t"+row.nickname);
		console.log("hash \t"+row.password);
		console.log("admin \t"+row.admin);
		console.log();
	  });
	});
	*/
	/*
	const name="Franz Bouvet"
	const sql_debug_select_4 = "UPDATE utilisateur SET admin=1 WHERE nickname=$1";
	pool.query(sql_debug_select_4, [name], (err, rows) => {
		if (err) {
			return console.error(err.message);
		}
		console.log("Admin Right Given to : "+name);
	});
	*/
	/*
	pool.query(sql_debug_select_3, [], (err, rows) => {
	  if (err) {
		return console.error(err.message);
	  }
	  rows.rows.forEach((row) => {
		console.log();
		console.log("userId \t"+row.userid);
		console.log("email \t"+row.email);
		console.log("name \t"+row.nickname);
		console.log("hash \t"+row.password);
		console.log("admin \t"+row.admin);
		console.log();
	  });
	});
	*/
	//--------------------=Admin end=--------------------
//========================================-Select end-========================================