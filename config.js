'use strict';

module.exports = {
  db: {
   production: "mongodb://george:orange1@oceanic.mongohq.com:10065/prod",
   development: "mongodb://george:orange1@oceanic.mongohq.com:10066/dev",
   test: "mongodb://george:orange1@oceanic.mongohq.com:10067/testing",
  },
  mailer: {
    auth: {
      user: 'test@example.com',
      pass: 'secret',
    },
    defaultFromAddress: 'First Last <test@examle.com>'
  }
};
