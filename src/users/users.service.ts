import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schema/user.schema';
import { faker, th } from '@faker-js/faker';

import { QueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel('user') private readonly usersModule: Model<User>) {}
  async onModuleInit() {
    const count = await this.usersModule.countDocuments();

    await this.usersModule.updateMany(
      { isguarantee: { $exists: false } },
      {
        $set: {
          isguarantee: true,
        },
      },
    );

    if (count === 0) {
      const dataToInsert: any = [];
      for (let i = 0; i < 200; i++) {
        dataToInsert.push({
          name: faker.person.firstName(),
          age: faker.number.int({ min: 11, max: 80 }),
          gender: faker.helpers.arrayElement(['m', 'f']),
        });
      }
      await this.usersModule.insertMany(dataToInsert);
      console.log(dataToInsert.slice(0, 5));
    }
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll({ name, ageFrom, ageTo, page, take, gender }: QueryParamsDto) {
    const filter: any = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (ageFrom) {
      filter.price = { ...filter.age, $gte: ageFrom };
    }
    if (ageTo) {
      filter.price = { ...filter.age, $lte: ageTo };
    }

    if (gender) {
      filter.gender = {$regex: name, $options: 'i'}
    }

    const users = await this.usersModule
      .find(filter)
      .skip((page - 1) * take)
      .limit(take);

    return users;
  }

  async findOne(id: number) {
    const user = await this.usersModule.findById(id);
    if (!user) {
      throw new NotFoundException('not found user by this Id ');
    }
    return user;
  }


  async getTotalUsers(): Promise<number> {
    return this.usersModule.countDocuments();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersModule.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('not update');
    }
    return updatedUser;
  }

  async remove(id: number) {
    const deletedUser = await this.usersModule.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new BadRequestException('not del');
    }
    return { message: 'user dilate sucs!' };
  }
}
