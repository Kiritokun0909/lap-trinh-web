var DataTypes = require('sequelize').DataTypes;
var _authors = require('./authors');
var _chapter_comments = require('./chapter_comments');
var _chapter_images = require('./chapter_images');
var _chapters = require('./chapters');
var _documents = require('./documents');
var _favorites = require('./favorites');
var _following = require('./following');
var _genres = require('./genres');
var _manga_comments = require('./manga_comments');
var _manga_genres = require('./manga_genres');
var _mangas = require('./mangas');
var _notifications = require('./notifications');
var _plan_mangas = require('./plan_mangas');
var _plans = require('./plans');
var _roles = require('./roles');
var _user_chapter_history = require('./user_chapter_history');
var _user_plans = require('./user_plans');
var _users = require('./users');

function initModels(sequelize) {
  var authors = _authors(sequelize, DataTypes);
  var chapter_comments = _chapter_comments(sequelize, DataTypes);
  var chapter_images = _chapter_images(sequelize, DataTypes);
  var chapters = _chapters(sequelize, DataTypes);
  var documents = _documents(sequelize, DataTypes);
  var favorites = _favorites(sequelize, DataTypes);
  var following = _following(sequelize, DataTypes);
  var genres = _genres(sequelize, DataTypes);
  var manga_comments = _manga_comments(sequelize, DataTypes);
  var manga_genres = _manga_genres(sequelize, DataTypes);
  var mangas = _mangas(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);
  var plan_mangas = _plan_mangas(sequelize, DataTypes);
  var plans = _plans(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var user_chapter_history = _user_chapter_history(sequelize, DataTypes);
  var user_plans = _user_plans(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  genres.belongsToMany(mangas, {
    as: 'MangaId_mangas_manga_genres',
    through: manga_genres,
    foreignKey: 'GenreId',
    otherKey: 'MangaId',
  });
  mangas.belongsToMany(genres, {
    as: 'GenreId_genres',
    through: manga_genres,
    foreignKey: 'MangaId',
    otherKey: 'GenreId',
  });
  mangas.belongsToMany(plans, { as: 'PlanId_plans', through: plan_mangas, foreignKey: 'MangaId', otherKey: 'PlanId' });
  mangas.belongsToMany(users, { as: 'UserId_users', through: favorites, foreignKey: 'MangaId', otherKey: 'UserId' });
  mangas.belongsToMany(users, {
    as: 'UserId_users_followings',
    through: following,
    foreignKey: 'MangaId',
    otherKey: 'UserId',
  });
  plans.belongsToMany(mangas, {
    as: 'MangaId_mangas_plan_mangas',
    through: plan_mangas,
    foreignKey: 'PlanId',
    otherKey: 'MangaId',
  });
  users.belongsToMany(mangas, { as: 'MangaId_mangas', through: favorites, foreignKey: 'UserId', otherKey: 'MangaId' });
  users.belongsToMany(mangas, {
    as: 'MangaId_mangas_followings',
    through: following,
    foreignKey: 'UserId',
    otherKey: 'MangaId',
  });
  mangas.belongsTo(authors, { as: 'Author', foreignKey: 'AuthorId' });
  authors.hasMany(mangas, { as: 'mangas', foreignKey: 'AuthorId' });
  chapter_comments.belongsTo(chapters, { as: 'Chapter', foreignKey: 'ChapterId' });
  chapters.hasMany(chapter_comments, { as: 'chapter_comments', foreignKey: 'ChapterId' });
  chapter_images.belongsTo(chapters, { as: 'Chapter', foreignKey: 'ChapterId' });
  chapters.hasMany(chapter_images, { as: 'chapter_images', foreignKey: 'ChapterId' });
  user_chapter_history.belongsTo(chapters, { as: 'Chapter', foreignKey: 'ChapterId' });
  chapters.hasMany(user_chapter_history, { as: 'user_chapter_histories', foreignKey: 'ChapterId' });
  manga_genres.belongsTo(genres, { as: 'Genre', foreignKey: 'GenreId' });
  genres.hasMany(manga_genres, { as: 'manga_genres', foreignKey: 'GenreId' });
  chapters.belongsTo(mangas, { as: 'Manga', foreignKey: 'MangaId' });
  mangas.hasMany(chapters, { as: 'Chapters', foreignKey: 'MangaId' });
  favorites.belongsTo(mangas, { as: 'Manga', foreignKey: 'MangaId' });
  mangas.hasMany(favorites, { as: 'favorites', foreignKey: 'MangaId' });
  following.belongsTo(mangas, { as: 'Manga', foreignKey: 'MangaId' });
  mangas.hasMany(following, { as: 'followings', foreignKey: 'MangaId' });
  manga_comments.belongsTo(mangas, { as: 'Manga', foreignKey: 'MangaId' });
  mangas.hasMany(manga_comments, { as: 'manga_comments', foreignKey: 'MangaId' });
  manga_genres.belongsTo(mangas, { as: 'Manga', foreignKey: 'MangaId' });
  mangas.hasMany(manga_genres, { as: 'manga_genres', foreignKey: 'MangaId' });
  notifications.belongsTo(mangas, { as: 'Manga', foreignKey: 'MangaId' });
  mangas.hasMany(notifications, { as: 'notifications', foreignKey: 'MangaId' });
  plan_mangas.belongsTo(mangas, { as: 'Manga', foreignKey: 'MangaId' });
  mangas.hasMany(plan_mangas, { as: 'plan_mangas', foreignKey: 'MangaId' });
  plan_mangas.belongsTo(plans, { as: 'Plan', foreignKey: 'PlanId' });
  plans.hasMany(plan_mangas, { as: 'plan_mangas', foreignKey: 'PlanId' });
  user_plans.belongsTo(plans, { as: 'Plan', foreignKey: 'PlanId' });
  plans.hasMany(user_plans, { as: 'user_plans', foreignKey: 'PlanId' });
  users.belongsTo(roles, { as: 'Role', foreignKey: 'RoleId' });
  roles.hasMany(users, { as: 'users', foreignKey: 'RoleId' });
  chapter_comments.belongsTo(users, { as: 'User', foreignKey: 'UserId' });
  users.hasMany(chapter_comments, { as: 'chapter_comments', foreignKey: 'UserId' });
  favorites.belongsTo(users, { as: 'User', foreignKey: 'UserId' });
  users.hasMany(favorites, { as: 'favorites', foreignKey: 'UserId' });
  following.belongsTo(users, { as: 'User', foreignKey: 'UserId' });
  users.hasMany(following, { as: 'followings', foreignKey: 'UserId' });
  manga_comments.belongsTo(users, { as: 'User', foreignKey: 'UserId' });
  users.hasMany(manga_comments, { as: 'manga_comments', foreignKey: 'UserId' });
  notifications.belongsTo(users, { as: 'User', foreignKey: 'UserId' });
  users.hasMany(notifications, { as: 'notifications', foreignKey: 'UserId' });
  user_chapter_history.belongsTo(users, { as: 'User', foreignKey: 'UserId' });
  users.hasMany(user_chapter_history, { as: 'user_chapter_histories', foreignKey: 'UserId' });
  user_plans.belongsTo(users, { as: 'User', foreignKey: 'UserId' });
  users.hasMany(user_plans, { as: 'user_plans', foreignKey: 'UserId' });

  return {
    authors,
    chapter_comments,
    chapter_images,
    chapters,
    documents,
    favorites,
    following,
    genres,
    manga_comments,
    manga_genres,
    mangas,
    notifications,
    plan_mangas,
    plans,
    roles,
    user_chapter_history,
    user_plans,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
