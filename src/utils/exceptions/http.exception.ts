import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply, RawServerBase } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply<RawServerBase>>();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseException = exception instanceof HttpException ? (exception.getResponse() as any) : { message: 'Internal Server Error' };
    
    response.status(status).send({
      errorCode: responseException?.errorCode,
      message: responseException?.message
    });
  }
}
