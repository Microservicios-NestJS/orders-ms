
import 'dotenv/config';
import * as joi  from 'joi';


interface EnvVars{
    PORT:number;
    PRODUCTS_MICROSERVICE_HOST:string;
    PRODUCTS_MICROSERVICE_PORT:number;
}

const envScherma= joi.object({
    PORT:joi.number().required(),
    PRODUCTS_MICROSERVICE_HOST:joi.string().required(),
    PRODUCTS_MICROSERVICE_PORT:joi.number().required(),

})
.unknown(true);


const {error,value} =envScherma.validate(process.env);

if(error){
    throw new Error(`config validation error ${error.message } `);

}

const envVars: EnvVars= value;

export const envs= {
    port:envVars.PORT,
    PRODUCTS_MICROSERVICE_HOST:envVars.PRODUCTS_MICROSERVICE_HOST,
    PRODUCTS_MICROSERVICE_PORT:envVars.PRODUCTS_MICROSERVICE_PORT,

}