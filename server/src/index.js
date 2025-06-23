import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { generateRandomKey, signJWT, verifyJWT } from './utils/utilities.js';
import { JWT_TYPE } from './utils/enums.js';

const SERVER_PORT = Number.parseInt(process.env.SERVER_PORT, 10) || '3000';

const SECRET_SIGNING_KEY = process.argv[2] || generateRandomKey();
const MAX_AGE = process.argv[3] || 24*60*60; // Defaults to 24 hours;
const TOKEN_NAME = process.argv[4] || 'jwt_access_token';
const ORIGIN = process.argv.length > 6 ? process.argv[5] : null;

const corsOptions = {
    origin: '*'
}

if(ORIGIN){
    corsOptions.origin = ORIGIN
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());


app.post('/createAuth',(req, res)=>{
    const { id } = req.body;
    if(!id){
        res.sendStatus(400);
        return;
    }
    const token = signJWT({id, maxAge: MAX_AGE}, SECRET_SIGNING_KEY);
    res.cookie(TOKEN_NAME, token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: MAX_AGE
    });
    res.sendStatus(200);
});

app.post('/verify', (req,res)=>{
    const token = req?.cookies?.[TOKEN_NAME];
    if(!token){
        res.sendStatus(401);
        return;
    }
    
    const {outcome} = verifyJWT(token, SECRET_SIGNING_KEY);
    if(outcome === JWT_TYPE.SUCCESS){
        res.sendStatus(200);
    }else{
        res.sendStatus(403);
    }
});

app.listen(SERVER_PORT, ()=>console.log(`Auth server listening on port ${SERVER_PORT}`));