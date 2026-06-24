import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ManagerError } from './../common/errors/manager.error';
import { SubjectsService } from './../subjects/subjects.service';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
    private readonly subjectsService: SubjectsService,
  ) {}

  async create(createTopicDto: CreateTopicDto) {
    try {
      const { subjectId, ...topicData } = createTopicDto;
      const subject = await this.subjectsService.findOne(subjectId);

      const existingTopic = await this.topicRepo.findOne({
        where: { name: topicData.name, subject: { id: subjectId } },
      });
      if (existingTopic) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'El tema ya existe en esta asignatura',
        });
      }

      const topic = this.topicRepo.create({ ...topicData, subject });
      const savedTopic = await this.topicRepo.save(topic);

      if (!savedTopic) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'Error al crear un tema',
        });
      }
      return savedTopic;
    } catch (error) {
      if (error instanceof ManagerError) {
        throw ManagerError.createSignatureError(error.message);
      }
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;
    try {
      const [topic, total] = await Promise.all([
        this.topicRepo.find({ skip: skip, take: limit }),
        this.topicRepo.count(),
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        data: topic,
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
      const topic = await this.topicRepo.findOne({
        where: { id },
        relations: { subject: true },
      });
      if (!topic)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Tema no encontrado',
        });
      return topic;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async update(id: string, updateTopicDto: UpdateTopicDto) {
    try {
      const { subjectId, ...topicData } = updateTopicDto;
      let subject;
      if (subjectId) subject = await this.subjectsService.findOne(subjectId);

      if (Object.keys(topicData).length === 0 && !subjectId) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'No se enviaron datos para actualizar',
        });
      }

      const topic = await this.topicRepo.update(id, {
        ...topicData,
        ...(subject && { subject }),
      });
      if (topic.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Tema no encontrado',
        });
      return topic;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const topic = await this.topicRepo.delete(id);
      if (topic.affected === 0)
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Tema no encontrado',
        });
      return topic;
    } catch (error) {
      if (error instanceof ManagerError)
        throw ManagerError.createSignatureError(error.message);
      throw error;
    }
  }
}
