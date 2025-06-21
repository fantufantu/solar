import { Preset } from '../any-use/preset.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { Category } from './category.entity';

@Entity()
export class ArticleWithCategory extends Preset {
  @Column({
    name: 'article_id',
  })
  articleId: number;

  @Column({
    name: 'category_code',
  })
  categoryCode: string;

  @ManyToOne(() => Article, (article) => article.articleWithCategory)
  @JoinColumn({ referencedColumnName: 'id', name: 'article_id' })
  article: Article;

  @ManyToOne(() => Category, (category) => category.articleWithCategory)
  @JoinColumn({ referencedColumnName: 'code', name: 'category_code' })
  category: Category;
}
