import { IdentifiedTimeStamped } from '../any-use/identified-time-stamped.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { Category } from './category.entity';

@Entity({ name: 'article_with_category' })
export class ArticleWithCategory extends IdentifiedTimeStamped {
  @Column({
    name: 'article_id',
  })
  articleId: number;

  @ManyToOne(() => Article, (article) => article.articleWithCategory)
  @JoinColumn({ referencedColumnName: 'id', name: 'article_id' })
  article: Article;

  @Column({
    name: 'category_code',
  })
  categoryCode: string;

  @ManyToOne(() => Category, (category) => category.articleWithCategory)
  @JoinColumn({ referencedColumnName: 'code', name: 'category_code' })
  category: Category;
}
