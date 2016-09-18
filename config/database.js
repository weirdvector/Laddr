  // database.js

var process = require('process');

module.exports = {

  'connection': {
    'host': 'localhost',
    'user': 'ladder',
    'password': 'codebusters',
    'database': 'Ladder'
  },
  'comments_table': 'LdrComments',
  'organizations_table': 'LdrOrganizations',
  'postings_table': 'LdrPostings',
  'profiles_table': 'LdrProfile',
  'topics_table': 'LdrTopics',
  'users_table': 'LdrUsers'
  
};
