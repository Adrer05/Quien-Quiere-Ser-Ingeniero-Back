import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ManagerError } from './../common/errors/manager.error';
import { TopicsService } from './../topics/topics.service';
import { DifficultiesService } from './../difficulties/difficulties.service';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    private readonly topicsService: TopicsService,
    private readonly difficultiesService: DifficultiesService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    try {
      const { topicId, difficultyId, ...questionData } = createQuestionDto;

      const topic = await this.topicsService.findOne(topicId);
      const difficulty = await this.difficultiesService.findOne(difficultyId);

      const question = this.questionRepo.create({
        ...questionData,
        topic,
        difficulty,
      });
      const savedQuestion = await this.questionRepo.save(question);

      if (!savedQuestion) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'Error al crear una pregunta',
        });
      }
      return savedQuestion;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;
    try {
      const [question, total] = await Promise.all([
        this.questionRepo.find({ skip: skip, take: limit }),
        this.questionRepo.count(),
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        data: question,
        meta: {
          total,
          page,
          limit,
          lastPage,
        },
      };
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }

      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const question = await this.questionRepo.findOne({
        where: { id },
        relations: { topic: true, difficulty: true },
      });
      if (!question)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Pregunta no encontrada',
        });
      return question;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    try {
      const { topicId, difficultyId, ...questionData } = updateQuestionDto;

      let topic;
      if (topicId) topic = await this.topicsService.findOne(topicId);

      let difficulty;
      if (difficultyId)
        difficulty = await this.difficultiesService.findOne(difficultyId);

      if (Object.keys(questionData).length === 0 && !topicId && !difficultyId) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'No se enviaron datos para actualizar',
        });
      }

      const question = await this.questionRepo.update(id, {
        ...questionData,
        ...(topic && { topic }),
        ...(difficulty && { difficulty }),
      });

      if (question.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Pregunta no encontrada',
        });
      return question;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const question = await this.questionRepo.delete(id);
      if (question.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Pregunta no encontrada',
        });
      return question;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }
}
