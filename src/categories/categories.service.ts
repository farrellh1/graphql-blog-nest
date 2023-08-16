import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryArgs } from './dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private repository: Repository<Category>,
  ) {}
  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const category = this.repository.create(createCategoryInput);
    return await this.repository.save(category);
  }

  async findAll(params: CategoryArgs): Promise<Category[]> {
    const queryBuilder = this.repository.createQueryBuilder('categories');
    queryBuilder
      .take(params.take)
      .skip(params.skip)
      .orderBy(`categories.${params.sortColumn}`, params.sortDirection);

    if (params.filter?.query) {
      queryBuilder.where('categories.name ILIKE :name', {
        name: `%${params.filter.query}%`,
      });
    }

    const { entities } = await queryBuilder.getRawAndEntities();
    return entities;
  }

  async findMany(ids: number[]): Promise<Category[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('categories')
      .whereInIds(ids);

    const { entities } = await queryBuilder.getRawAndEntities();
    return entities;
  }

  async findOne(id: number): Promise<Category> {
    return await this.repository.findOneByOrFail({ id });
  }

  async update(
    id: number,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    const category = await this.findOne(id);
    return await this.repository.save({ ...category, ...updateCategoryInput });
  }

  async remove(id: number): Promise<Category> {
    const category = await this.findOne(id);
    return await this.repository.remove(category);
  }
}
