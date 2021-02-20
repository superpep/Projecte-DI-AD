const db = require('./database');
const User = require('./users');

module.exports = class crudUsers{
    mydb = new db();
    constructor(){}
    
    getAllUsers(callback){
        let con = this.mydb.getConnection();
        let sql = "SELECT id, username, password, full_name, avatar FROM users";
        con.query(sql, function(err, results){
            if(err){
                console.error(err);
            } else{
                con.end();
                var users = [];
                results.forEach(user => {
                    users.push(new User(user.id, user.username, user.password, user.full_name, user.avatar));
                });
            }
            callback(err, users);
        });
    }

    getProfesDNI(callback){
        let con = this.mydb.getConnection();
        let sql = "SELECT dni FROM dni_profe";
        con.query(sql, function(err, results){
            if(err){
                console.error(err);
            } else{
                con.end();
                var DNIs = [];
                results.forEach(ele => {
                    DNIs.push(ele.dni);
                });
            }
            callback(DNIs, err);
        });
    }

    getProfes(callback){
        let con = this.mydb.getConnection();
        let sql = "SELECT * FROM professor";
        con.query(sql, function(err, results){
            if(err){
                console.error(err);
            } else{
                con.end();
                var profes = [];
                results.forEach(profe => {
                    profes.push(profe);
                });
            }
            callback(profes, err);
        });
    }

    insertUser(user, callback){
        let con = this.mydb.getConnection();
        let sql = "INSERT INTO users(username, password, full_name, avatar) VALUES(?, ?, ?, ?)";
        con.query(sql, [user.username, user.password, user.full_name, user.avatar], (err, results)=>{
            if(err){
                console.error(err);
            } else{
                con.end();
            }
            callback(err, results);
        });
    }

    insertProfe(id, callback){
        let con = this.mydb.getConnection();
        let sql = "INSERT INTO professor(id) VALUES(?)";
        con.query(sql, [id], (err, results)=>{
            if(err){
                console.error(err);
            } else{
                con.end();
            }
            callback(err, results);
        });
    }

    insertAlumne(id, callback){
        let con = this.mydb.getConnection();
        let sql = "INSERT INTO alumne(id) VALUES(?)";
        con.query(sql, [id], (err, results)=>{
            if(err){
                console.error(err);
            } else{
                con.end();
            }
            callback(err, results);
        });
    }
};