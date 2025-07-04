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
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async onModuleInit() {
    const count = await this.userModel.countDocuments();

    await this.userModel.updateMany(
      { isguarantee: { $exists: false } },
      {
        $set: {
          isguarantee: true,
        },
      },
    );

    if (count === 0) {
      const dataToInsert: any = [];
      for (let i = 0; i < 300_000; i++) {
        dataToInsert.push({
          name: faker.person.firstName(),
          age: faker.number.int({ min: 11, max: 80 }),
          gender: faker.helpers.arrayElement(['m', 'f']),
        });
      }
      await this.userModel.insertMany(dataToInsert);
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
  
    if (gender) {
      filter.gender = { $regex: gender, $options: 'i' }; 
    }
  
    if (ageFrom !== undefined || ageTo !== undefined) {
      filter.age = {};
      if (ageFrom !== undefined) filter.age.$gte = ageFrom;
      if (ageTo !== undefined) filter.age.$lte = ageTo;
  
      if (Object.keys(filter.age).length === 0) {
        delete filter.age;
      }
    }
    const users = await this.userModel
      .find(filter)
      .skip((page - 1) * take)
      .limit(take);

    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('not found user by this Id ');
    }
    return user;
  }


  async getTotalUsers(){
    console.log("shemovida")
    const users = await this.userModel.countDocuments();
    console.log(users)
    return users
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('not update');
    }
    return updatedUser;
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new BadRequestException('not del');
    }
    return { message: 'user dilate sucs!' };
  }
}
