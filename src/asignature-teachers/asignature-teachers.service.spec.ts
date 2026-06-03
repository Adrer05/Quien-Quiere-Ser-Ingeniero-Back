import { Test, TestingModule } from '@nestjs/testing';
import { AsignatureTeachersService } from './asignature-teachers.service';

describe('AsignatureTeachersService', () => {
  let service: AsignatureTeachersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsignatureTeachersService],
    }).compile();

    service = module.get<AsignatureTeachersService>(AsignatureTeachersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
