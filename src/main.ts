import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Handler, Context, Callback } from 'aws-lambda';
import serverless from 'serverless-http';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Permite CORS para o Netlify

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  server = serverless(expressApp);
}

bootstrap();

export const handler: Handler = (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!server) {
    bootstrap().then(() => server(event, context, callback));
  } else {
    server(event, context, callback);
  }
};
