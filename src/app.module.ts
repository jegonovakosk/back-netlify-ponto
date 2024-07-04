import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkHoursModule } from './work-hours/work-hours.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis de ambiente acessíveis globalmente
    }),
    MongooseModule.forRoot(
      'mongodb+srv://jnovakosk:Ocz3tGhgIbyFVqOF@pontohora.xpjylwh.mongodb.net/?retryWrites=true&w=majority&appName=PontoHora',
    ),
    UserModule,
    AuthModule,
    WorkHoursModule, // Importando o módulo de usuário
  ],
})
export class AppModule {}
