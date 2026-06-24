import { Test, TestingModule } from '@nestjs/testing';
import { AsignatureTeachersController } from './asignature-teachers.controller';
import { AsignatureTeachersService } from './asignature-teachers.service';

describe('AsignatureTeachersController', () => {
  let controller: AsignatureTeachersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsignatureTeachersController],
      providers: [AsignatureTeachersService],
    }).compile();

    controller = module.get<AsignatureTeachersController>(
      AsignatureTeachersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
