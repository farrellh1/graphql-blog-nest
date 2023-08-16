import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { CategoryArgs } from './dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guard';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly service: CategoriesService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    return this.service.create(createCategoryInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Category], { name: 'categories' })
  findAll(@Args() params: CategoryArgs): Promise<Category[]> {
    return this.service.findAll(params);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Category> {
    return this.service.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Category)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    return this.service.update(updateCategoryInput.id, updateCategoryInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Category)
  removeCategory(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    return this.service.remove(id);
  }
}
