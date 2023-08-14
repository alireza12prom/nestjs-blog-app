import fs from 'fs';

export class Filesystem {
  static exists(path: string) {
    return fs.existsSync(path);
  }

  static deleteIfExists(path: string) {
    fs.unlinkSync(path);
  }

  static openReadStream(path: string) {
    return fs.createReadStream(path);
  }

  static rename(from: string, to: string) {
    return fs.renameSync(from, to);
  }
}
