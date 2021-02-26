const db = require('./database');

module.exports = class crudMissatgeria{
    mydb = new db();
    constructor(){}

    getMissatgesFromAlumneProfe(id_profe, id_alumne, callback){
        let con = this.mydb.getConnection();
        let sql = "SELECT moment, missatge, imatge, origen from missatgeria WHERE id_profe = ? AND id_alumne = ? ORDER BY moment DESC";
        con.query(sql, [id_profe, id_alumne], (err, results) => {
            if(err){
                console.error(err)
            }
            callback(err, results)
        })
    }

    setMissatge(missatge, origen, id_profe, id_alumne, callback){
        let con = this.mydb.getConnection();
        let sql = "INSERT INTO missatgeria(missatge, origen, id_profe, id_alumne) VALUES (?, ?, ?, ?)";
        con.query(sql, [missatge, origen, id_profe, id_alumne], (err, results) => {
            if(err){
                console.error(err)
            }
            callback(err, results)
        })
    }
}
