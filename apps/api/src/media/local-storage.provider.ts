import { Injectable } from '@nestjs/common';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { StorageProvider } from './storage-provider.interface';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly baseDir = join(process.cwd(), 'uploads');

  async save(file: Express.Multer.File, folder = 'media'): Promise<string> {
    const dir = join(this.baseDir, folder);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    const ext = extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    const filepath = join(dir, filename);

    await writeFile(filepath, file.buffer);

    return `${folder}/${filename}`;
  }

  async delete(uri: string): Promise<void> {
    const filepath = join(this.baseDir, uri);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }
  }

  getUrl(uri: string): string {
    return `/uploads/${uri}`;
  }
}
