import { Injectable, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
  );

  use(req: any, res: any, next: () => void) {
    this.morganMiddleware(req, res, next);
  }
}
