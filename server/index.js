const express = require('express');
const crudUsers = require('./db/crudUsers')
const crudNotes = require('./db/crudNotes')
const crudAssignatures = require('./db/crudAssignatures')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const jwtAuth = require('./auth/authenticate')
const PORT = require('./lib/constants').PORT

let app = express();
app.use(bodyParser.json());
app.listen(PORT, ()=> {
    console.log('Escolte al port '+PORT);
});
app.post('/register', (req, res)=>{
    const {dni, username, full_name, avatar, password} = req.body;
    let crudUs = new crudUsers();
    crudUs.getUserByUsername(username, (results, err)=>{
        if(err){ // Tenim en compte si ha habut un error a la BD
            res.status(500).send({
                ok: false,
                error: err
            });
        } else{ // Si no hi ha error, comprovem si l'usuari ja està a la BD o no
            if(results.length){ // Si està, retornem error.
                res.status(400).send({
                    ok: false,
                    error: "L'usuari ja està afegit."
                });
            } else{ // Si l'usuari encara no està a la BD...
                crudUs.checkDNIProfe(dni, (resultDNI, err)=>{ // Agafem els dnis de professors per veure si l'usuari és un professor
                    if(err){ // Si mysql ens dona error, el retornem
                        res.status(500).send({
                            ok: false,
                            error: "Server error: "+err
                        });
                    } else{ // Si tot va bé, farem l'inserció d'usuari
                        crudUs.insertUser({username:username, password:password, full_name:full_name, avatar:avatar}, (err, results, fields)=>{
                            if(err){ // Si mysql ens dona error, el retornem
                                res.status(500).send({
                                    ok: false,
                                    error: "Server error: "+err
                                });
                            } else{ // Si l'inserció en la taula d'usuaris s'ha dut a terme...
                                let userId = results.insertId;
                                if(resultDNI.length){ // Comprovem, per tant, si és profe o no
                                    crudUs.insertProfe(userId); // Si és, insertem l'id del nou usuari a la taula de professors
                                    var role = 'profe'
                                } else{
                                    crudUs.insertAlumne(userId); // Si no és, insertem l'id al de alumnes
                                    var role = 'alumne'
                                }
                                
                                // CONSTRUIM ELS TOKENS
                                const tokenAuth = jwt.sign({
                                    user_id:userId,
                                    username:username,
                                    role:role
                                }, jwtAuth.accessTokenSecret, {expiresIn: '2h'});

                                const refreshToken = jwt.sign({
                                    user_id: userId,
                                    username:username,
                                    role:role
                                }, jwtAuth.refreshTokenSecret);

                                jwtAuth.refreshTokens.push(refreshToken);
                                
                                // Retornem les dades
                                res.status(200).send({
                                    ok:true,
                                    data: {
                                        tokenAuth: tokenAuth,
                                        refreshToken: refreshToken,
                                        avatar: avatar
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});
app.post('/login', (req, res)=>{
    const {username, password} = req.body;
    let crudUs = new crudUsers(); 
    crudUs.getUserAuth(username, password, (err,user)=>{    
        if(err){ // Tenim en compte si ha habut un error a la BD
            res.status(401).send({
                ok: false,
                error: err
            });
        } else {
            let avatar = ""
            if(user.id){ // Si el id d'usuari ha sigut actualitzat...
                crudUs.getProfeById(user.id, (result, err)=>{ // Agafem els profes per a veure si l'usuari és professor
                    if(err){ // Si mysql ens retorna un error, el retornem nosaltres
                        res.status(500).send({
                            ok: false,
                            error: err
                        });
                    }
                    if(result.length){ // Si el length és major que 0, significa que ha havut un match
                        var role = "profe"; 
                    } else { // Si no, significa que l'usuari és alumne
                        var role = "alumne";
                    }

                    // CREEM ELS TOKENS
                    const tokenAuth = jwt.sign({
                        user_id: user.id,
                        username:username,
                        role:role
                    }, jwtAuth.accessTokenSecret, {expiresIn: '2h'});

                    const refreshToken = jwt.sign({
                        user_id: user.id,
                        username:username,
                        role:role
                    }, jwtAuth.refreshTokenSecret);

                    jwtAuth.refreshTokens.push(refreshToken);

                    res.status(200).send({ // Retronem les dades correctament
                        ok:true,
                        data: {
                            tokenAuth: tokenAuth,
                            refreshToken: refreshToken,
                            avatar: avatar
                        }
                    });
                });
            } else { // Si ve per aci, el login és incorrecte, no hi ha match amb l'usuari i contrasenya
                res.status(401).send({
                    ok: false,
                    error: "Login incorrecte"
                });
            }
        }
    })
});

// Estaría bé fer un enrutador per a notes i móduls
app.get('/notes', jwtAuth.authenticateJWT, jwtAuth.authorizeAlumne, (req, res)=>{
    const user = req.user;
    crudNot = new crudNotes();
    crudNot.getNotesFromUser(user.user_id, (err, result)=>{
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
    });
});

app.get('/notes/:id', jwtAuth.authenticateJWT, jwtAuth.authorizeAlumne, (req, res)=>{
    crudNot = new crudNotes();
    crudNot.getNotesByFromAssig(req.params.id, req.user.user_id, (err, result)=>{
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
    });
})

app.get('/assignatura/:id', jwtAuth.authenticateJWT, (req, res)=>{
    crudAssig = new crudAssignatures();
    crudAssig.getAssigById(req.params.id, (err, result)=>{
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
})

app.get('/moduls', jwtAuth.authenticateJWT, jwtAuth.authorizeProfe, (req, res)=>{
    crudAssig = new crudAssignatures();
    crudAssig.getProfesAssigs(req.user.user_id, (err, result)=>{
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
    });
});

app.get('/moduls/:id', jwtAuth.authenticateJWT, jwtAuth.authorizeProfe, (req, res)=>{
    crudNot = new crudNotes();
    crudNot.getNotesByAssigAndProfeId(req.params.id, req.user.user_id, (err, result)=>{
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
    });
});

app.put('/moduls/:id_assig/:id_alu', jwtAuth.authenticateJWT, jwtAuth.authorizeProfe, (req, res)=>{
    crudNot = new crudNotes();
    crudNot.setNotesToAlu(req.params.id_assig, req.params.id_alu, req.user.user_id, req.body.nota, (err, changes)=>{
        if(err){
            res.status(400).send({
                ok: false,
                error: err
            })
        } else {
            res.status(200).send({
                ok: changes.affectedRows > 0,
            })
        }
    })
})