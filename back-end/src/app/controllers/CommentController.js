const { get } = require('../../routes/CommentRoute');
const CommentService = require('../services/CommentService');
const { StatusCodes } = require('http-status-codes');

const {
  getHeaderToken,
  getUserFromToken,
  getUserIdFromToken,
} = require('../../utils/TokenUtil');
const Messages = require('../../utils/Messages');
const { formatISODate } = require('../../utils/DateUtil');
class CommentController {
  async addChapterComment(req, res) {
    const { chapterId, context, commentParentId } = req.body;
    const userId = getUserIdFromToken(getHeaderToken(req));

    try {
      const newComment = await CommentService.addChapterComment(
        chapterId,
        userId,
        context,
        commentParentId
      );
      if (!newComment) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Failed to add comment' });
      }
      res.status(StatusCodes.CREATED).json({ message: 'Comment added successfully' });
    } catch (error) {
      console.error('Error adding comment:', error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to add comment' });
    }
  }
  async getChapterCommentsWithReplies(req, res) {
    const { chapterId } = req.params;
    const { page, limit } = req.query;
    const userId = getUserIdFromToken(getHeaderToken(req));

    try {
      const comments = await CommentService.getChapterCommentsWithReplies(
        chapterId,
        page,
        limit,
        userId
      );
      res.status(StatusCodes.OK).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  async updateChapterComment(req, res) {
    const { commentId, context } = req.body;

    const userId = getUserIdFromToken(getHeaderToken(req));

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    try {
      await CommentService.updateChapterComment(commentId, context, userId);
      res.status(StatusCodes.OK).json({ message: 'Comment updateed successfully' });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async deleteChapterComment(req, res) {
    const { commentId } = req.params;
    const userId = getUserIdFromToken(getHeaderToken(req));

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    try {
      await CommentService.deleteChapterComment(commentId, userId);
      res.status(StatusCodes.OK).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  async getMangaCommentsWithReplies(req, res) {
    const { mangaId } = req.params;
    const { page, limit } = req.query;
    const userId = getUserIdFromToken(getHeaderToken(req));

    try {
      const comments = await CommentService.getMangaCommentsWithReplies(
        mangaId,
        page,
        limit,
        userId
      );
      res.status(StatusCodes.OK).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  async addMangaComment(req, res) {
    const { mangaId, context, commentParentId } = req.body;

    const userId = getUserIdFromToken(getHeaderToken(req));

    try {
      const newComment = await CommentService.addMangaComment(
        mangaId,
        userId,
        context,
        commentParentId
      );
      if (!newComment) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Failed to add comment' });
      }
      res.status(StatusCodes.CREATED).json({ message: 'Comment added successfully' });
    } catch (error) {
      console.error('Error adding comment:', error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to add comment' });
    }
  }
  async updateMangaComment(req, res) {
    const { commentId, context } = req.body;
    const userId = getUserIdFromToken(getHeaderToken(req));

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    try {
      await CommentService.updateMangaComment(commentId, context, userId);
      res.status(StatusCodes.OK).json({ message: 'Comment updated successfully' });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  async deleteMangaComment(req, res) {
    const { commentId } = req.params;
    const userId = getUserIdFromToken(getHeaderToken(req));

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    try {
      await CommentService.deleteMangaComment(commentId, userId);
      res.status(StatusCodes.OK).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}

module.exports = new CommentController();
