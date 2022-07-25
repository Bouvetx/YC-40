const express = require("express");
const session = require('express-session');
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
// Creating the Express server
const app = express();
const crypto = require('crypto');
//--------------------=YC40 start=--------------------
const db_name = path.join(__dirname, "data", "YC40.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
	return console.error(err.message);
  }
  console.log("Successful connection to the database 'YC40.db'");
});
//--------------------=YC40 end=--------------------
db.serialize(() => {
//========================================-Drop table start-========================================
	//--------------------=Users end=--------------------
	/*
	const sql_debug_drop_1 = `DROP table user;`;
	db.run(sql_debug_drop_1, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Drop user");
	});
	*/
	//--------------------=Users end=--------------------
	//--------------------=Actu start=--------------------
	
	const sql_debug_drop_2 = `DROP table actu;`;
	db.run(sql_debug_drop_2, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Drop actu");
	});
	
	//--------------------=Actu end=--------------------
	//--------------------=Answer start=--------------------
	/*
	const sql_debug_drop_3 = `DROP table answer;`;
	db.run(sql_debug_drop_3, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Drop answer");
	});
	*/
	//--------------------=Answer end=--------------------
	/*
	//--------------------=ActuA start=--------------------
	const sql_debug_drop_4 = `DROP table actuA;`;
	db.run(sql_debug_drop_4, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Drop actuA");
	});
	*/
	//--------------------=ActuA end=--------------------
//========================================-Drop table end-========================================
//========================================-Create table start-========================================
	//--------------------=Users start=--------------------
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
	//--------------------=Users start=--------------------
	//--------------------=Actu start=--------------------
	const sql_create_db_actu = `CREATE TABLE IF NOT EXISTS actu (
	  actuId INTEGER PRIMARY KEY AUTOINCREMENT,
	  title TEXT NOT NULL,
	  content TEXT NOT NULL,
	  author TEXT NOT NULL,
	  authorId TEXT NOT NULL,
	  image TEXT default "default.jpg",
	  date TEXT default current_timestamp
	);`;
	
	db.run(sql_create_db_actu, err => {
	  if (err) {
		return console.error(err.message);
	  }
	  console.log("Successful creation of the 'actu' table");
	});
	//--------------------=Actu end=--------------------
	//--------------------=Answer start=--------------------
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
	//--------------------=Answer end=--------------------
//========================================-Create table end-========================================
//========================================-Select start-========================================
	//--------------------=Users start=--------------------
	/*
	const sql_debug_select_1 = "SELECT * from user";
	db.all(sql_debug_select_1, [], (err, rows) => {
	  if (err) {
		throw err;
	  }
	  rows.forEach((row) => {
		console.log();
		console.log("userId \t"+row.userId);
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
	/*
	const sql_debug_select_2 = "SELECT * FROM actu"
	db.all(sql_debug_select_2, [], (err, rows) => {
		if (err) {
			return console.error(err.message);
		}
		console.log(rows);
		rows.forEach((row) => {
			console.log();
			console.log("actuId \t"+row.actuId);
			console.log("title \t"+row.title);
			console.log("content \t"+row.content);
			console.log("authorId \t"+row.authorId);
			console.log("author \t"+row.author);
			console.log("date \t"+row.date);
			console.log();
		});
	});
	*/
	//--------------------=Actu end=--------------------
	//--------------------=Admin start=--------------------
	/*
	const sql_debug_select_3 = "SELECT * from user";
	db.all(sql_debug_select_3, [], (err, rows) => {
	  if (err) {
		return console.error(err.message);
	  }
	  rows.forEach((row) => {
		console.log();
		console.log("userId \t"+row.userId);
		console.log("email \t"+row.email);
		console.log("name \t"+row.nickname);
		console.log("hash \t"+row.password);
		console.log("admin \t"+row.admin);
		console.log();
	  });
	});

	const sql_debug_select_4 = "UPDATE user SET admin=1 WHERE userId=1";
	db.run(sql_debug_select_4, [], (err, rows) => {
		if (err) {
			return console.error(err.message);
		}
	});
	
	db.all(sql_debug_select_3, [], (err, rows) => {
	  if (err) {
		return console.error(err.message);
	  }
	  rows.forEach((row) => {
		console.log();
		console.log("userId \t"+row.userId);
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
});