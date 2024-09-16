import { Preset } from 'assets/entities/preset.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { Category } from './category.entity';

@Entity()
export class ArticleToCategory extends Preset {
  @Column()
  articleId: number;

  @Column()
  categoryCode: string;

  @ManyToOne(() => Article, (article) => article.articleToCategory)
  @JoinColumn({ referencedColumnName: 'id' })
  article: Article;

  @ManyToOne(() => Category, (category) => category.articleToCategory)
  @JoinColumn({ referencedColumnName: 'code' })
  category: Category;
}
