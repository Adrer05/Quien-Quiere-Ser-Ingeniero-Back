import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { ManagerError } from './../common/errors/manager.error';
import { QuestionsService } from './../questions/questions.service';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
    private readonly questionsService: QuestionsService,
  ) {}

  async create(createAnswerDto: CreateAnswerDto) {
    try {
      const { questionId, isCorrect, ...answerData } = createAnswerDto;

      const question = await this.questionsService.findOne(questionId);

      const totalAnswers = await this.answerRepo.count({
        where: { question: { id: questionId } },
      });

      if (totalAnswers >= 4) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'La pregunta ya tiene el máximo de 4 respuestas',
        });
      }

      const correctCount = await this.answerRepo.count({
        where: { question: { id: questionId }, isCorrect: true },
      });

      if (isCorrect && correctCount >= 1) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'La pregunta ya tiene una respuesta correcta',
        });
      }

      const isLastAnswer = totalAnswers === 3;
      if (isLastAnswer && correctCount === 0 && !isCorrect) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'La pregunta debe tener al menos una respuesta correcta',
        });
      }

      const answer = this.answerRepo.create({ ...answerData, isCorrect, question });
      const savedAnswer = await this.answerRepo.save(answer);

      if (!savedAnswer) {
        throw new ManagerError({ type: 'BAD_REQUEST', message: 'Error al crear una respuesta' });
      }
      return savedAnswer;
    } catch (error) {
      if (error instanceof ManagerError) throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto
    const skip = ( page - 1 ) * limit;
    try {
      const [answer, total] = await Promise.all([
        this.answerRepo.find({ skip: skip, take: limit }),
        this.answerRepo.count(),
      ])

      const lastPage = Math.ceil( total/limit )

      return {
        data: answer,
        meta: {
          total, 
          page,
          limit,
          lastPage
        }
      }
    } catch (error) {
      if(error instanceof ManagerError){
        throw ManagerError.createSignatureError(error.message);
      }

      throw error
    }
  }

  async findOne(id: string) {
    try {
      const answer = await this.answerRepo.findOneBy({ id })
      if (!answer) throw new ManagerError({ type: 'NOT_FOUND', message: 'Usuario no encontrado' });

      return answer
    } catch (error) {
      if(error instanceof ManagerError){
        throw ManagerError.createSignatureError(error.message);
      }

      throw error
    }
  }

  async update(id: string, updateAnswerDto: UpdateAnswerDto) {
    try {
      const answer = await this.answerRepo.update(id, updateAnswerDto);
      if(answer.affected===0){
        throw new ManagerError({ type: "NOT_FOUND", message: "Usuario no encontrado" });
      }

      return answer
    } catch (error) {
      if(error instanceof ManagerError){
        throw ManagerError.createSignatureError(error.message);
      }

      throw error
    }
  }

  async remove(id: string) {
    try {
      const answer = await this.answerRepo.delete(id)
      if(answer.affected===0){
        throw new ManagerError({ type: "NOT_FOUND", message: "Usuario no encontrado" });
      }
      return answer
    } catch (error) {
      if(error instanceof ManagerError){
        throw ManagerError.createSignatureError(error.message);
      }

      throw error
    }
  }
}
