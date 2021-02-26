const express = require('express');
const crudMissatgeria = require('../db/crudMissatgeria');
let jwtAuth = require('../auth/authenticate')
let router = express.Router();

router.get('/', jwtAuth.authenticateJWT, (req, res) => {
    if(req.body.profe_id){ // SI EN EL BODY, EL PARÀMETRE ÉS EL ID DE PROFESSOR, SIGNIFICA QUE QUI ESTÀ CONSULTANT ELS MISSATGES ÉS UN ALUMNE
        var profe_id = req.body.profe_id
        var alu_id = req.user.user_id
    } else{
        var profe_id = req.user.user_id
        var alu_id = req.body.alu_id
    }
    crudMissatges = new crudMissatgeria();
    crudMissatges.getMissatgesFromAlumneProfe(profe_id, alu_id, (err, result) => {
        if(err){
            res.status(400).send({
                ok: false,
                error: err
            })
        } else {
            res.status(200).send({
                ok: true,
                data: result
            })
        }
    })
});

router.post('/', jwtAuth.authenticateJWT, (req, res) => {
    const missatge = req.body.missatge
    if(req.user.role == 'profe'){ // SI L'ORIGE ÉS D'UN ALUMNE, 
        var origen = 'P'
        var profe_id = req.user.user_id
        var alu_id = req.body.alu_id
    } else{
        var origen = 'A'
        var profe_id = req.body.profe_id
        var alu_id = req.user.user_id
    }
    crudMissatges = new crudMissatgeria();
    crudMissatges.setMissatge(missatge, origen, profe_id, alu_id, (err, result) => {
        if(err){
            res.status(400).send({
                ok: false,
                error: err
            })
        } else {
            res.status(200).send({
                ok: result.affectedRows > 0
            })
        }
    })
})

module.exports = router;