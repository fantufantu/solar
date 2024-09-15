import { Preset } from 'assets/entities/preset.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { Category } from './category.entity';

@Entity()
export class ArticleToCategory extends Preset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'article_id' })
  articleId: number;

  @Column({ name: 'category_code' })
  categoryCode: string;

  @ManyToOne(() => Article, (article) => article.articleToCategory)
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @ManyToOne(() => Category, (category) => category.articleToCategory)
  @JoinColumn({ name: 'category_code', referencedColumnName: 'code' })
  category: Category;
}
