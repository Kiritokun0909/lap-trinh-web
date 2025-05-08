const { chapter_comments, users, manga_comments } = require('../../models/init-models')(
  require('../../configs/DbConfig')
);
const { formatISODate } = require('../../utils/DateUtil');
const convertKeysToCamelCase = require('../../utils/CamelCaseUtil');
const { ROLE_USER } = require('../../utils/HandleCode');
const ROLE_ADMIN = require('../../utils/HandleCode').ROLE_ADMIN;
class CommentService {
  async addChapterComment(chapterId, userId, context, commentParentId) {
    try {
      if (!commentParentId) {
        commentParentId = null;
      }
      let commentRootId = null;
      if (commentParentId !== null) {
        const parentComment = await chapter_comments.findOne({ where: { CommentId: commentParentId } });
        commentRootId = parentComment.CommentRootId || commentParentId;
      }
      const newComment = await chapter_comments.create({
        ChapterId: chapterId,
        UserId: userId,
        Context: context,
        CommentParentId: commentParentId,
        CommentRootId: commentRootId,
      });
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment');
    }
  }
  async getChapterCommentsWithReplies(chapterId, page = 1, limit = 10, userId = null) {
    try {
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      const offset = (page - 1) * limit;

      const { count, rows } = await chapter_comments.findAndCountAll({
        where: { ChapterId: chapterId, CommentParentId: null },
        limit,
        offset,
        order: [['CreatedAt', 'DESC']],
        attributes: ['CommentId', 'UserId', 'Context', 'CreatedAt', 'UpdatedAt', 'IsUpdated', 'IsDeleted'],
      });

      let showDeletedCommentContext = false;
      if (userId) {
        const user = await users.findOne({ where: { UserId: userId }, attributes: ['UserId', 'RoleId'] });
        if (user && user.RoleId === ROLE_ADMIN) {
          showDeletedCommentContext = true;
        }
      }

      const commentsWithReplies = await Promise.all(
        rows.map(async (comment) => {
          const replies = await chapter_comments.findAll({
            where: { CommentRootId: comment.CommentId },
            attributes: [
              'CommentId',
              'UserId',
              'Context',
              'CreatedAt',
              'UpdatedAt',
              'IsUpdated',
              'IsDeleted',
              'CommentParentId',
            ],
            //order: [['CreateAt', 'ASC']],
          });
          // const user = await users.findOne({
          //   where: { UserId: comment.UserId },
          //   attributes: ['UserId', 'Username', 'Avatar'],
          // });

          const formattedComment = {
            ...comment.get(),
            // User: user ? convertKeysToCamelCase(user.get()) : null,
            Context: comment.IsDeleted && !showDeletedCommentContext ? 'Bình luận đã bị xóa' : comment.Context,
            CreatedAt: formatISODate(comment.CreatedAt),
            UpdatedAt: formatISODate(comment.UpdatedAt),
          };
          // delete formattedComment.UserId;
          const formattedReplies = replies.map((reply) => {
            return {
              ...reply.get(),
              Context: reply.IsDeleted && !showDeletedCommentContext ? 'Bình luận đã bị xóa' : reply.Context,
              CreatedAt: formatISODate(reply.CreatedAt),
              UpdatedAt: formatISODate(reply.UpdatedAt),
            };
          });

          return {
            ...formattedComment,
            replies: formattedReplies,
          };
        })
      );

      return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        comments: commentsWithReplies,
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
  }

  async updateChapterComment(commentId, context, userId) {
    try {
      if (userId === null) {
        throw new Error('User not authorized to update this comment');
      }
      if (!commentId || !context) {
        throw new Error('Comment ID and context are required');
      }

      const comment = await chapter_comments.findOne({ where: { CommentId: commentId, UserId: userId } });
      if (!comment) {
        throw new Error('User not authorized to update this comment');
      }
      const updatedComment = await chapter_comments.update(
        { Context: context, IsUpdated: 1, UpdatedAt: new Date() },
        { where: { CommentId: commentId } }
      );
      return updatedComment;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new Error(error.message);
    }
  }
  async deleteChapterComment(commentId, userId) {
    try {
      if (userId === null) {
        throw new Error('User not authorized to delete this comment');
      }
      if (!commentId) {
        throw new Error('Comment ID is required');
      }
      const whereClause = { CommentId: commentId };
      const user = await users.findOne({ where: { UserId: userId }, attributes: ['UserId', 'RoleId'] });
      if (user && user.RoleId === ROLE_USER) {
        whereClause.UserId = userId;
      }

      const comment = await chapter_comments.findOne({ where: whereClause });
      if (!comment) {
        throw new Error('User not authorized to delete this comment');
      }
      const isAnyReply = await chapter_comments.findOne({ where: { CommentParentId: commentId } });
      if (!isAnyReply) {
        await chapter_comments.destroy({ where: { CommentId: commentId } });
        return { success: true, message: 'Comment deleted successfully' };
      }
      await chapter_comments.update({ IsDeleted: 1 }, { where: { CommentId: commentId } });
      return { success: true, message: 'Comment deleted successfully' };
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new Error(error.message);
    }
  }

  async addMangaComment(mangaId, userId, context, commentParentId) {
    try {
      if (!commentParentId) {
        commentParentId = null;
      }
      let commentRootId = null;
      if (commentParentId !== null) {
        const parentComment = await manga_comments.findOne({ where: { CommentId: commentParentId } });
        commentRootId = parentComment.CommentRootId || commentParentId;
      }
      const newComment = await manga_comments.create({
        MangaId: mangaId,
        UserId: userId,
        Context: context,
        CommentParentId: commentParentId,
        CommentRootId: commentRootId,
      });
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment');
    }
  }
  async getMangaCommentsWithReplies(mangaId, page = 1, limit = 10, userId = null) {
    try {
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      const offset = (page - 1) * limit;

      const { count, rows } = await manga_comments.findAndCountAll({
        where: { MangaId: mangaId, CommentParentId: null },
        limit,
        offset,
        order: [['CreatedAt', 'DESC']],
        attributes: ['CommentId', 'UserId', 'Context', 'CreatedAt', 'UpdatedAt', 'IsUpdated', 'IsDeleted'],
      });

      let showDeletedCommentContext = false;
      if (userId) {
        const user = await users.findOne({ where: { UserId: userId }, attributes: ['UserId', 'RoleId'] });
        if (user && user.RoleId === ROLE_ADMIN) {
          showDeletedCommentContext = true;
        }
      }

      const commentsWithReplies = await Promise.all(
        rows.map(async (comment) => {
          const replies = await manga_comments.findAll({
            where: { CommentRootId: comment.CommentId },
            attributes: [
              'CommentId',
              'UserId',
              'Context',
              'CreatedAt',
              'UpdatedAt',
              'IsUpdated',
              'IsDeleted',
              'CommentParentId',
            ],
          });

          const formattedComment = {
            ...comment.get(),

            Context: comment.IsDeleted && !showDeletedCommentContext ? 'Bình luận đã bị xóa' : comment.Context,
            CreatedAt: formatISODate(comment.CreatedAt),
            UpdatedAt: formatISODate(comment.UpdatedAt),
          };

          const formattedReplies = replies.map((reply) => {
            return {
              ...reply.get(),
              Context: reply.IsDeleted && !showDeletedCommentContext ? 'Bình luận đã bị xóa' : reply.Context,
              CreatedAt: formatISODate(reply.CreatedAt),
              UpdatedAt: formatISODate(reply.UpdatedAt),
            };
          });

          return {
            ...formattedComment,
            replies: formattedReplies,
          };
        })
      );
      return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        comments: commentsWithReplies,
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
  }
  async updateMangaComment(commentId, context, userId) {
    try {
      if (userId === null) {
        throw new Error('User not authorized to update this comment');
      }
      if (!commentId || !context) {
        throw new Error('Comment ID and context are required');
      }

      const comment = await manga_comments.findOne({ where: { CommentId: commentId, UserId: userId } });
      if (!comment) {
        throw new Error('User not authorized to update this comment');
      }
      const updatedComment = await manga_comments.update(
        { Context: context, IsUpdated: 1, UpdatedAt: new Date() },
        { where: { CommentId: commentId } }
      );
      return updatedComment;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new Error(error.message);
    }
  }

  async deleteMangaComment(commentId, userId) {
    try {
      if (userId === null) {
        throw new Error('User not authorized to delete this comment');
      }
      if (!commentId) {
        throw new Error('Comment ID is required');
      }
      const whereClause = { CommentId: commentId };
      const user = await users.findOne({ where: { UserId: userId }, attributes: ['UserId', 'RoleId'] });
      if (user && user.RoleId === ROLE_USER) {
        whereClause.UserId = userId;
      }

      const comment = await manga_comments.findOne({ where: whereClause });
      if (!comment) {
        throw new Error('User not authorized to delete this comment');
      }
      const isAnyReply = await manga_comments.findOne({ where: { CommentParentId: commentId } });
      if (!isAnyReply) {
        await manga_comments.destroy({ where: { CommentId: commentId } });
        return { success: true, message: 'Comment deleted successfully' };
      }
      await manga_comments.update({ IsDeleted: 1 }, { where: { CommentId: commentId } });
      return { success: true, message: 'Comment deleted successfully' };
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new Error(error.message);
    }
  }
}

module.exports = new CommentService();
