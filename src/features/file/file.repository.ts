import { BaseRepository } from '@features/base.repository';
import FileEntity from './file.entity';
import { IFile } from './file.types';

/**
 * File Repository
 * Handles database operations for files
 */
class FileRepository extends BaseRepository<IFile> {
  constructor() {
    super(FileEntity);
  }
}

export default FileRepository;
