import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/lib/database/entities/mercury/user.entity';
import type { Nullable } from '@aiszlab/relax/types';

@Injectable()
export class UserLoader {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public readonly getUserById = new DataLoader<number, Nullable<User>>(
    async (userIds) => {
      const users = (
        await this.userRepository.findBy({
          id: In(userIds),
        })
      ).reduce(
        (prev, user) => prev.set(user.id, user),
        new Map<number, User>(),
      );

      return userIds.map((userId) => {
        return users.get(userId) ?? null;
      });
    },
    {
      cache: false,
    },
  );
}
