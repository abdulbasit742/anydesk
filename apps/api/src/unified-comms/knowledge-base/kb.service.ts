/**
 * Knowledge Base & Help Center Service
 */

import { randomUUID } from 'node:crypto';

export interface KBCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  order: number;
  articleCount: number;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KBArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categoryId: string;
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  language: string;
  translations: Record<string, { title: string; content: string }>;
  tags: string[];
  views: number;
  helpfulYes: number;
  helpfulNo: number;
  videoUrl: string | null;
  attachments: string[];
  version: number;
  versionHistory: ArticleVersion[];
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface ArticleVersion {
  version: number;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  tags: string[];
  upvotes: number;
  replies: ForumReply[];
  pinned: boolean;
  locked: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ForumReply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: string;
}

const categories = new Map<string, KBCategory>();
const articles = new Map<string, KBArticle>();
const forumPosts = new Map<string, ForumPost>();

// Default categories
const defaultCategories: KBCategory[] = [
  { id: 'cat-getting-started', name: 'Getting Started', slug: 'getting-started', description: 'Quick start guides and tutorials', parentId: null, order: 1, articleCount: 0, icon: 'rocket', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-remote-desktop', name: 'Remote Desktop', slug: 'remote-desktop', description: 'Remote connection guides', parentId: null, order: 2, articleCount: 0, icon: 'monitor', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-troubleshooting', name: 'Troubleshooting', slug: 'troubleshooting', description: 'Fix common issues', parentId: null, order: 3, articleCount: 0, icon: 'wrench', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-account', name: 'Account & Billing', slug: 'account-billing', description: 'Manage your account', parentId: null, order: 4, articleCount: 0, icon: 'user', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-security', name: 'Security', slug: 'security', description: 'Security best practices', parentId: null, order: 5, articleCount: 0, icon: 'shield', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-api', name: 'API & Integrations', slug: 'api-integrations', description: 'Developer documentation', parentId: null, order: 6, articleCount: 0, icon: 'code', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
defaultCategories.forEach(c => categories.set(c.id, c));

export class KnowledgeBaseService {
  // Categories
  async getCategories(): Promise<KBCategory[]> {
    return Array.from(categories.values()).sort((a, b) => a.order - b.order);
  }

  async createCategory(data: { name: string; description: string; parentId?: string; icon?: string }): Promise<KBCategory> {
    const category: KBCategory = {
      id: randomUUID(),
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description,
      parentId: data.parentId || null,
      order: categories.size + 1,
      articleCount: 0,
      icon: data.icon || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    categories.set(category.id, category);
    return category;
  }

  async updateCategory(id: string, data: Partial<KBCategory>): Promise<KBCategory | null> {
    const cat = categories.get(id);
    if (!cat) return null;
    Object.assign(cat, data, { updatedAt: new Date().toISOString() });
    categories.set(id, cat);
    return cat;
  }

  // Articles
  async getArticles(filter?: { categoryId?: string; status?: string; search?: string; language?: string }): Promise<KBArticle[]> {
    let results = Array.from(articles.values());
    if (filter?.categoryId) results = results.filter(a => a.categoryId === filter.categoryId);
    if (filter?.status) results = results.filter(a => a.status === filter.status);
    if (filter?.language) results = results.filter(a => a.language === filter.language);
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(a => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)));
    }
    return results.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getArticle(id: string): Promise<KBArticle | null> {
    const article = articles.get(id);
    if (article) {
      article.views++;
      articles.set(id, article);
    }
    return article || null;
  }

  async createArticle(data: { title: string; content: string; categoryId: string; authorId: string; tags?: string[]; language?: string; videoUrl?: string }): Promise<KBArticle> {
    const article: KBArticle = {
      id: randomUUID(),
      title: data.title,
      slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      content: data.content,
      excerpt: data.content.substring(0, 200),
      categoryId: data.categoryId,
      authorId: data.authorId,
      status: 'draft',
      language: data.language || 'en',
      translations: {},
      tags: data.tags || [],
      views: 0,
      helpfulYes: 0,
      helpfulNo: 0,
      videoUrl: data.videoUrl || null,
      attachments: [],
      version: 1,
      versionHistory: [{ version: 1, title: data.title, content: data.content, authorId: data.authorId, createdAt: new Date().toISOString() }],
      seoTitle: null,
      seoDescription: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: null,
    };
    articles.set(article.id, article);

    // Update category count
    const cat = categories.get(data.categoryId);
    if (cat) {
      cat.articleCount++;
      categories.set(cat.id, cat);
    }

    return article;
  }

  async updateArticle(id: string, data: Partial<KBArticle> & { authorId?: string }): Promise<KBArticle | null> {
    const article = articles.get(id);
    if (!article) return null;

    // Save version
    if (data.content && data.content !== article.content) {
      article.version++;
      article.versionHistory.push({
        version: article.version,
        title: data.title || article.title,
        content: data.content,
        authorId: data.authorId || article.authorId,
        createdAt: new Date().toISOString(),
      });
    }

    if (data.title) article.title = data.title;
    if (data.content) { article.content = data.content; article.excerpt = data.content.substring(0, 200); }
    if (data.status) {
      article.status = data.status;
      if (data.status === 'published' && !article.publishedAt) article.publishedAt = new Date().toISOString();
    }
    if (data.tags) article.tags = data.tags;
    if (data.categoryId) article.categoryId = data.categoryId;
    article.updatedAt = new Date().toISOString();

    articles.set(id, article);
    return article;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return articles.delete(id);
  }

  async rateArticle(id: string, helpful: boolean): Promise<KBArticle | null> {
    const article = articles.get(id);
    if (!article) return null;
    if (helpful) article.helpfulYes++;
    else article.helpfulNo++;
    articles.set(id, article);
    return article;
  }

  async searchArticles(query: string): Promise<KBArticle[]> {
    const q = query.toLowerCase();
    return Array.from(articles.values())
      .filter(a => a.status === 'published')
      .filter(a => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)))
      .sort((a, b) => b.views - a.views)
      .slice(0, 20);
  }

  async addTranslation(id: string, language: string, title: string, content: string): Promise<KBArticle | null> {
    const article = articles.get(id);
    if (!article) return null;
    article.translations[language] = { title, content };
    article.updatedAt = new Date().toISOString();
    articles.set(id, article);
    return article;
  }

  // Forum
  async getForumPosts(categoryId?: string): Promise<ForumPost[]> {
    let results = Array.from(forumPosts.values());
    if (categoryId) results = results.filter(p => p.categoryId === categoryId);
    return results.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }

  async createForumPost(data: { title: string; content: string; authorId: string; authorName: string; categoryId: string; tags?: string[] }): Promise<ForumPost> {
    const post: ForumPost = {
      id: randomUUID(),
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      authorName: data.authorName,
      categoryId: data.categoryId,
      tags: data.tags || [],
      upvotes: 0,
      replies: [],
      pinned: false,
      locked: false,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    forumPosts.set(post.id, post);
    return post;
  }

  async replyToForumPost(postId: string, data: { content: string; authorId: string; authorName: string }): Promise<ForumReply | null> {
    const post = forumPosts.get(postId);
    if (!post || post.locked) return null;
    const reply: ForumReply = {
      id: randomUUID(),
      content: data.content,
      authorId: data.authorId,
      authorName: data.authorName,
      upvotes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
    };
    post.replies.push(reply);
    post.updatedAt = new Date().toISOString();
    forumPosts.set(postId, post);
    return reply;
  }

  async getArticleAnalytics(): Promise<{ totalArticles: number; totalViews: number; avgHelpfulness: number; topArticles: { id: string; title: string; views: number }[] }> {
    const all = Array.from(articles.values());
    const totalViews = all.reduce((sum, a) => sum + a.views, 0);
    const totalRatings = all.reduce((sum, a) => sum + a.helpfulYes + a.helpfulNo, 0);
    const totalPositive = all.reduce((sum, a) => sum + a.helpfulYes, 0);

    return {
      totalArticles: all.length,
      totalViews,
      avgHelpfulness: totalRatings > 0 ? (totalPositive / totalRatings) * 100 : 0,
      topArticles: all.sort((a, b) => b.views - a.views).slice(0, 10).map(a => ({ id: a.id, title: a.title, views: a.views })),
    };
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
