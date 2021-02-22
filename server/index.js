const express = require('express');
const crudUsers = require('./db/crudUsers')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


let app = express();
app.use(bodyParser.json());
app.listen(8080, ()=> {
    console.log('Escolte al port 8000');
});

const accessTokenSecret = '?;>+Z@^Jw{O~,2*h)TrV1$?0/t_lsb';
const refreshTokenSecret = '*g">j`{yX,D1UI7)laqbNEWzEr26HO';
const refreshTokens = [];
app.post('/register', (req, res)=>{
    const {dni, username, full_name, avatar, password} = req.body;
    let crudUs = new crudUsers();
    crudUs.getAllUsers((users, err)=>{
        if(err){ // Tenim en compte si ha habut un error a la BD
            res.status(500).send({
                ok: false,
                error: err
            });
        } else{ // Si no hi ha error, comprovem si l'usuari ja està a la BD o no
            if(users.find(user => user.username == username)){ // Si està, retornem error.
                res.status(400).send({
                    ok: false,
                    error: "L'usuari ja està afegit."
                });
            } else{ // Si l'usuari encara no està a la BD...
                crudUs.getProfesDNI((dnis, err)=>{ // Agafem els dnis de professors per veure si l'usuari és un professor
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
                                if(dnis.find(dnis => dnis.dni == dni)){ // Comprovem, per tant, si és profe o no
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
                                }, accessTokenSecret, {expiresIn: '2h'});

                                const refreshToken = jwt.sign({
                                    user_id: userId,
                                    username:username,
                                    role:role
                                }, refreshTokenSecret);

                                refreshTokens.push(refreshToken);
                                
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
    crudUs.getAllUsers((err,users)=>{    
        if(err){ // Tenim en compte si ha habut un error a la BD
            res.status(500).send({
                ok: false,
                error: err
            });
        } else {
            let userId = -1;
            let avatar = ""
            users.forEach(user=>{
                if(user.username == username){
                    if (user.password == password){ // Si la contrasenya de l'usuari és igual a la contrasenya que ens han enviat..
                        userId = user.id;
                        avatar = user.avatar
                    } else { // Si no, significa que l'autenticació falla
                        res.status(401).send({ // 401: Unauthorized
                            ok: false,
                            error: "Error en la contrasenya"
                        });
                    }
                }
            });
            if(userId != -1){ // Si el id d'usuari ha sigut actualitzat...
                crudUs.getProfes((profes, err)=>{ // Agafem els profes per a veure si l'usuari és professor
                    if(err){ // Si mysql ens retorna un error, el retornem nosaltres
                        res.status(500).send({
                            ok: false,
                            error: err
                        });
                    }
                    if(profes.find(profe => profe.id == userId)){ // Busquem algún profe que tinga el mateix identificador que l'usuari
                        var role = "profe"; 
                    } else { // Si no el trovem, significa que l'usuari és alumne
                        var role = "alumne";
                    }

                    // CREEM ELS TOKENS
                    const tokenAuth = jwt.sign({
                        user_id: userId,
                        username:username,
                        role:role
                    }, accessTokenSecret, {expiresIn: '2h'});

                    const refreshToken = jwt.sign({
                        user_id: userId,
                        username:username,
                        role:role
                    }, refreshTokenSecret);

                    refreshTokens.push(refreshToken);

                    res.status(200).send({ // Retronem les dades correctament
                        ok:true,
                        data: {
                            tokenAuth: tokenAuth,
                            refreshToken: refreshToken,
                            avatar: avatar
                        }
                    });
                });
            } else { // En cas de que no s'haja actualitzat l'id d'usuari, significa que no s'ha trovat ningún usuar amb el nom proporcionat
                res.status(401).send({
                    ok: false,
                    error: "L'usuari no existeix"
                });
            }
        }
    })
});