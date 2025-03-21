import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVERS,  } from 'src/config';


@Module({
    imports:[   ClientsModule.register([
        { name: NATS_SERVERS, 
        transport: Transport.NATS,
         options:{
          servers: envs.nats_servers,
         } 
      },
      ]),],
      exports:[   ClientsModule.register([
        { name: NATS_SERVERS, 
        transport: Transport.NATS,
         options:{
          servers: envs.nats_servers,
         } 
      },
      ]),]
})
export class NastModule {}
