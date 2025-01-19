const i18n = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');

i18n.use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  backend: {
    loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
  },
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

module.exports = i18n;
