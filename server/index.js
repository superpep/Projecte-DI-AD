const express = require('express');
const crudUsers = require('./db/crudUsers')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const encrypt = require('./lib/crypto');


let app = express();
app.use(bodyParser.json());
app.listen(8080, ()=> {
    console.log('Escolte al port 8000');
});

const accessTokenSecret = '?;>+Z@^Jw{O~,2*h)TrV1$?0/t_lsb';
const refreshTokenSecret = '*g">j`{yX,D1UI7)laqbNEWzEr26HO';
const refreshTokens = [];
app.post('/register', (req, res)=>{
    const {dni, username, full_name, avatar} = req.body;
    const password = encrypt(req.body.password);
    let crudUs = new crudUsers();
    crudUs.getAllUsers((users, err)=>{
        if(err){ // Tenim en compte si ha habut un error a la BD
            res.status(500).send({
                ok: false,
                error: err
            });
        } else{ // Si no hi ha error, comprovem si l'usuari ja està a la BD o no
            if(users.find(user => user.username == username)){ // Si està, retornem error.
                res.status(500).send({
                    ok: false,
                    error: "L'usuari ja està afegit."
                });
            } else{
                crudUs.getProfesDNI((dnis, err)=>{
                    if(err){
                        res.status(500).send({
                            ok: false,
                            error: "Server error: "+err
                        });
                    } else{
                        crudUs.insertUser({username:username, password:password, full_name:full_name, avatar:avatar}, (err, results, fields)=>{
                            if(err){
                                res.status(500).send({
                                    ok: false,
                                    error: "Server error: "+err
                                });
                            } else{
                                let userId = results.insertId;
                                if(dnis.find(dnis => dnis.dni == dni)){ // Comprovem si és profe o no
                                    crudUs.insertProfe(userId);
                                    var role = 'profe'
                                } else{
                                    crudUs.insertAlumne(userId);
                                    var role = 'alumne'
                                }
                                
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
    const username = req.body.username;
    const password = encrypt(req.body.password);
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
                    if (user.password == password){
                        userId = user.id;
                        avatar = user.avatar
                    } else {
                        res.status(500).send({
                            ok: false,
                            error: "Error en la contrasenya"
                        });
                    }
                }
            });
            if(userId != -1){
                crudUs.getProfes((profes, err)=>{
                    if(err){
                        res.status(500).send({
                            ok: false,
                            error: err
                        });
                    }
                    if(profes.find(profe => profe.id == userId)){
                        var role = "profe";
                    } else {
                        var role = "alumne";
                    }

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

                    res.status(200).send({
                        ok:true,
                        data: {
                            tokenAuth: tokenAuth,
                            refreshToken: refreshToken,
                            avatar: avatar
                        }
                    });
                });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "L'usuari no existeix"
                });
            }
        }
    })
});