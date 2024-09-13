import { Injectable } from '@nestjs/common';
import DataLoader = require('dataloader');
import { SubjectService } from '../subject/subject.service';
import { Subject } from '../subject/entities/subject.entity';
import { Billing } from '../billing/entities/billing.entity';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class TransactionLoader {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly billingService: BillingService,
  ) {}

  /**
   * @author murukal
   * @description
   * 根据科目id获取科目信息
   */
  readonly subjectLoader = new DataLoader<number, Subject | null>(
    async (ids: number[]) => {
      const [subjects] = await this.subjectService.getCategories({
        filterBy: {
          ids,
        },
      });

      return ids.map(
        (id) => subjects.find((subject) => subject.id === id) || null,
      );
    },
  );

  /**
   * @author murukal
   * @description
   * 根据账本id获取账本
   */
  readonly billingLoader = new DataLoader<number, Billing | null>(
    async (ids: number[]) => {
      const billings = await this.billingService.getBillingsByIds(ids);

      return ids.map(
        (id) => billings.find((billing) => billing.id === id) || null,
      );
    },
  );
}
