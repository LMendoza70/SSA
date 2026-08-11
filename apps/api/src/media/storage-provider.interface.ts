export interface StorageProvider {
  save(file: Express.Multer.File, folder?: string): Promise<string>;
  delete(uri: string): Promise<void>;
  getUrl(uri: string): string;
}
