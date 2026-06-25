/**
 * Knowledge Base & Help Center API Routes
 */

import { Router } from 'express';
import { knowledgeBaseService } from './kb.service.js';

const router = Router();

// Categories
router.get('/categories', async (_req, res) => {
  const categories = await knowledgeBaseService.getCategories();
  res.json(categories);
});

router.post('/categories', async (req, res) => {
  const category = await knowledgeBaseService.createCategory(req.body);
  res.status(201).json(category);
});

router.put('/categories/:id', async (req, res) => {
  const category = await knowledgeBaseService.updateCategory(req.params.id, req.body);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

// Articles
router.get('/articles', async (req, res) => {
  const filter = {
    categoryId: req.query.categoryId as string,
    status: req.query.status as string,
    search: req.query.search as string,
    language: req.query.language as string,
  };
  const articles = await knowledgeBaseService.getArticles(filter);
  res.json(articles);
});

router.post('/articles', async (req, res) => {
  if (!req.body.title || !req.body.content || !req.body.categoryId) {
    return res.status(400).json({ error: 'title, content, and categoryId are required' });
  }
  const authorId = (req as any).userId || 'system';
  const article = await knowledgeBaseService.createArticle({ ...req.body, authorId });
  res.status(201).json(article);
});

router.get('/articles/:id', async (req, res) => {
  const article = await knowledgeBaseService.getArticle(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

router.put('/articles/:id', async (req, res) => {
  const authorId = (req as any).userId || 'system';
  const article = await knowledgeBaseService.updateArticle(req.params.id, { ...req.body, authorId });
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

router.delete('/articles/:id', async (req, res) => {
  const deleted = await knowledgeBaseService.deleteArticle(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Article not found' });
  res.status(204).send();
});

// Search
router.get('/search', async (req, res) => {
  const query = req.query.q as string;
  if (!query) return res.status(400).json({ error: 'q parameter is required' });
  const results = await knowledgeBaseService.searchArticles(query);
  res.json(results);
});

// Rate article
router.post('/articles/:id/rate', async (req, res) => {
  const { helpful } = req.body;
  if (helpful === undefined) return res.status(400).json({ error: 'helpful (boolean) is required' });
  const article = await knowledgeBaseService.rateArticle(req.params.id, helpful);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json({ helpfulYes: article.helpfulYes, helpfulNo: article.helpfulNo });
});

// Translations
router.post('/articles/:id/translate', async (req, res) => {
  const { language, title, content } = req.body;
  if (!language || !title || !content) return res.status(400).json({ error: 'language, title, and content are required' });
  const article = await knowledgeBaseService.addTranslation(req.params.id, language, title, content);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// Analytics
router.get('/analytics', async (_req, res) => {
  const analytics = await knowledgeBaseService.getArticleAnalytics();
  res.json(analytics);
});

// Forum
router.get('/forum', async (req, res) => {
  const posts = await knowledgeBaseService.getForumPosts(req.query.categoryId as string);
  res.json(posts);
});

router.post('/forum', async (req, res) => {
  const authorId = (req as any).userId || 'anonymous';
  const post = await knowledgeBaseService.createForumPost({ ...req.body, authorId });
  res.status(201).json(post);
});

router.post('/forum/:id/reply', async (req, res) => {
  const authorId = (req as any).userId || 'anonymous';
  const reply = await knowledgeBaseService.replyToForumPost(req.params.id, { ...req.body, authorId });
  if (!reply) return res.status(404).json({ error: 'Post not found or locked' });
  res.status(201).json(reply);
});

export default router;
