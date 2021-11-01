import * as supertest from 'supertest';

export class FileReceiverRequestSender {
  public constructor(private readonly app: Express.Application) {}

  public async sendFile(filePath: string | undefined, content: string | object, useQueryInsteadOfHeader = false): Promise<supertest.Response> {
    const query = useQueryInsteadOfHeader ? `?filename=${encodeURIComponent(filePath ?? '')}` : '';
    const req = supertest.agent(this.app).post(`/fileReceiver${query}`).set('Content-Type', 'application/octet-stream');
    if (!useQueryInsteadOfHeader && filePath !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      req.set('filename', filePath);
    }
    return req.send(content);
  }
}
