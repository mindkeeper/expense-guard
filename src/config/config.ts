import { IConfigProps } from './config.interface';

export const config = (): IConfigProps => ({
  envFilePath: process.env.NODE_ENV === 'development' ? '.env.local' : '.env',
});
