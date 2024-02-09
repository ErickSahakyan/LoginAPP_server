import express from "express";
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connect from './database/data';
import { router } from './routes/routes';

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.disable('x-powered-by')
dotenv.config()


app.use('/api/auth', router)



connect().then(() => {
    try {
        app.listen(
            process.env.PORT,
            () => console.log(`Server is connected and listening on port: http://${process.env.HOST}:${process.env.PORT}`)
        )
    } catch (error) {
        console.log('Cannot connect to the server', error)
    }
}).catch(error => {
    console.log("Invalid database connection...!", error);
});