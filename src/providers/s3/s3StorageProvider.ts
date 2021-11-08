import { Readable } from 'stream';
import { S3, Credentials } from 'aws-sdk';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
import { inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IConfig } from '../../common/interfaces';
import { IStorageProvider } from '../storageProvider';
import { IS3Config } from './iS3Config';

export class S3StorageProvider implements IStorageProvider {
  private readonly bucket: string;
  private readonly s3: S3;

  public constructor(@inject(SERVICES.CONFIG) config: IConfig) {
    const s3Config = config.get<IS3Config>('S3');
    this.bucket = s3Config.bucket;
    const credentials: CredentialsOptions = {
      accessKeyId: s3Config.accessKeyId,
      secretAccessKey: s3Config.secretAccessKey,
    };
    const awsCredentials = new Credentials(credentials);
    const endpoint = s3Config.endpointUrl;
    const sslEnabled = s3Config.sslEnabled;
    this.s3 = new S3({
      credentials: awsCredentials,
      endpoint: endpoint,
      sslEnabled: sslEnabled,
      s3ForcePathStyle: true,
    });
  }

  public async saveFile(path: string, contentStream: Readable): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const params = { Bucket: this.bucket, Key: path, Body: contentStream };
    return this.s3.upload(params).promise();
  }

  public async exists(path: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const params = { Bucket: this.bucket, Key: path };
    return this.s3
      .headObject(params)
      .promise()
      .then(() => true)
      .catch(() => false);
  }
}
