import { ResumeService } from './resume.service';
import type { Resume } from '@/libs/database/entities/mars/resume.entity';
import type { Repository } from 'typeorm';
import type { MercuryClientService } from '@/libs/mercury-client';

describe('ResumeService', () => {
  const resume = { id: 'resume-id', createdById: 'user-id' } as Resume;
  const repository = {
    create: jest.fn(() => ({})),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  } as unknown as jest.Mocked<Repository<Resume>>;
  const service = new ResumeService(repository, {} as MercuryClientService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('includes soft-deleted resumes when permanently removing one', async () => {
    repository.findOne.mockResolvedValue(resume);

    await expect(
      service.remove(resume.id, resume.createdById, true),
    ).resolves.toBe(true);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: resume.id },
      withDeleted: true,
    });
    expect(repository.findOneBy).not.toHaveBeenCalled();
  });

  it('excludes soft-deleted resumes from ordinary removal', async () => {
    repository.findOneBy.mockResolvedValue(resume);

    await expect(
      service.remove(resume.id, resume.createdById, false),
    ).resolves.toBe(true);

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: resume.id });
    expect(repository.findOne).not.toHaveBeenCalled();
  });
});
