import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from '@/libs/database/entities/jupiter/membership.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
  ) {}

  findAll() {
    return this.membershipRepository.find();
  }

  findOne(id: number) {
    return this.membershipRepository.findOneBy({ id });
  }

  create(name: string, quota: number, price: number) {
    return this.membershipRepository.save(
      this.membershipRepository.create({ name, quota, price }),
    );
  }

  async update(id: number, input: Partial<Pick<Membership, 'name' | 'quota' | 'price'>>) {
    await this.membershipRepository.update(id, input);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.membershipRepository.softDelete(id);
    return true;
  }
}
