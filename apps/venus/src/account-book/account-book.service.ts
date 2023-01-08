// nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// third
import { Repository } from 'typeorm';
// project
import { Share, TargetType } from '../share/entities/share.entity';
import { ShareService } from '../share/share.service';
import { CreateAccountBookInput } from './dto/create-account-book.input';
import { SetDefaultArgs } from './dto/set-default.args';
import { UpdateAccountBookInput } from './dto/update-account-book.input';
import { AccountBook } from './entities/account-book.entity';

@Injectable()
export class AccountBookService {
  constructor(
    @InjectRepository(AccountBook)
    private readonly accountBookRepository: Repository<AccountBook>,
    private readonly shareService: ShareService,
  ) {}

  /**
   * 创建账本
   */
  create(createAccountBookInput: CreateAccountBookInput, createdById: number) {
    return this.accountBookRepository.save(
      this.accountBookRepository.create({
        ...createAccountBookInput,
        createdById,
      }),
    );
  }

  /**
   * 查询多个账本
   */
  async getAccountBooks(userId: number) {
    return await this.accountBookRepository
      .createQueryBuilder('accountBook')
      .leftJoinAndSelect(
        Share,
        'share',
        'share.targetType = :targetType AND share.targetId = accountBook.id',
        {
          targetType: TargetType.AccountBook,
        },
      )
      .where('isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .andWhere(
        '( accountBook.createdById = :userId OR share.sharedById = :userId )',
        {
          userId,
        },
      )
      .getMany();
  }

  /**
   * 查询单个账本
   */
  getAccountBook(id: number, userId: number) {
    return this.accountBookRepository
      .createQueryBuilder('accountBook')
      .leftJoinAndSelect(
        Share,
        'share',
        'share.targetType = :targetType AND share.targetId = accountBook.id',
        {
          targetType: TargetType.AccountBook,
        },
      )
      .whereInIds(id)
      .andWhere('isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .andWhere(
        '( accountBook.createdById = :userId OR share.sharedById = :userId )',
        {
          userId,
        },
      )
      .getOne();
  }

  /**
   * 更新账本信息
   */
  update(id: number, updateAccountBookInput: UpdateAccountBookInput) {
    return this.accountBookRepository.update(id, updateAccountBookInput);
  }

  /**
   * 删除账本信息
   * 操作人为账本所有人，删除账本的所有分享，删除账本
   * 操作人非账本所有人，仅删除账本的相关分享
   */
  async remove(id: number, userId: number) {
    const accountBook = await this.accountBookRepository.findOneBy({
      id,
      isDeleted: false,
    });

    if (!accountBook) {
      return true;
    }

    const isCreator = accountBook.createdById === userId;

    // 删除分享
    // 账本创建人，删除当前账本的全部分享 -> 删除账本
    // 非账本创建人，仅删除当前账本的被分享条目即可
    const isShareRemoved = await this.shareService.remove({
      targetId: id,
      targetType: TargetType.AccountBook,
      sharedById: isCreator ? undefined : userId,
    });

    if (!isCreator) return isShareRemoved;

    // 分享删除成功执行删除账本
    return (
      isShareRemoved &&
      !!(
        await this.accountBookRepository.update(id, {
          isDeleted: true,
        })
      ).affected
    );
  }

  /**
   * 切换默认账本
   * 切换账本是否默认
   */
  async setDefault(setDefaultArgs: SetDefaultArgs, userId: number) {
    let existed = await this.userProfileRepository.findOneBy({
      userId,
    });

    // 不存在用户信息则创建
    if (!existed) {
      existed = await this.userProfileRepository.save(
        this.userProfileRepository.create({
          userId,
        }),
      );
    }

    // 更新用户信息
    const isUpdated = !!(
      await this.userProfileRepository.update(userId, {
        defaultBillingId: switchDefaultArgs.isDefault
          ? switchDefaultArgs.id
          : null,
      })
    ).affected;

    // 返回默认的账本信息

    return isUpdated;
  }
}
