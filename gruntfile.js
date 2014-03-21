'use strict';

module.exports = function (grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: ['gruntfile.js', 'server.js', 'app/**/*.js', 'public/js/**', 'test/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['public/views/**', 'app/views/**'],
        options: {
          livereload: true
        }
      },
      css: {
        files: ['public/css/**'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: ['gruntfile.js', 'server.js', 'app/**/*.js', 'public/js/**', 'test/**/*.js', '!test/coverage/**/*.js'],
        options: {
          jshintrc: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          ignore: ['public/**'],
          ext: 'js',
          nodeArgs: ['--debug'],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      },
      e2e: {
        script: 'server.js',
        options: {
          ignore: ['public/**'],
          ext: 'js',
          env: {
            PORT: 8000,
            NODE_ENV: 'test'
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon:dev', 'nodemon:e2e', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    },
    karma: {
      unit: {
        configFile: 'test/client/support/karma.conf.js'
      }
    },
    protractor: {
      e2e: {
        options: {
          configFile: 'test/e2e/support/protractor.conf.js', // Default config file
          keepAlive: false, // If false, the grunt process stops when the test fails.
          noColor: false, // If true, protractor will not use colors in its output.
          debug: false,
          args: {
            // Arguments passed to the command
          }
        }
      }
    }
  });

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-protractor-runner');

  //Default task(s).
  grunt.registerTask('default', 'concurrent');

  //Test task.
  grunt.registerTask('test', 'Run client, server and e2e tests, with JSHint', ['jshint', 'test:server', 'test:client', 'test:e2e']);

  grunt.registerTask('test:client', 'Run client tests', ['env:test', 'karma:unit']);
  grunt.registerTask('test:e2e', 'Run e2e tests', ['env:test', 'db:drop', 'db:seed', 'protractor']);
  grunt.registerTask('test:server', 'Run server tests', ['env:test', 'db:drop', 'test:server:shell']);

  grunt.registerTask('test:server:shell', 'Run `test:server` instead.', function () {
    var shell = require('shelljs');
    var code = shell.exec('JASMINE_CONFIG_PATH=test/server/support/jasmine.conf.json ./node_modules/jasmine/bin/jasmine.js');
    return code > 0 ? new Error('Specs have failed.') : null;
  });

  // DB Tasks
  grunt.registerTask('db:drop', 'Drop the DB', function () {
    var config = require('./config/config');
    var mongoose = require('mongoose');
    var connection = mongoose.connect(config.db).connections[0];
    var done = this.async();

    connection.on('open', function () {
      connection.db.dropDatabase(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully dropped ' + config.db + ' database');
        }
        connection.close(done);
      });
    });
  });


  grunt.registerTask('db:seed', 'Seed the DB with a user', function () {
    var config = require('./config/config');
    var mongoose = require('mongoose');
    var connection = mongoose.connect(config.db).connections[0];
    var done = this.async();

    mongoose.Model.seed = function (entities) {
      var promise = new mongoose.Promise();
      this.create(entities, function (err) {
        if (err) {
          promise.reject(err);
        }
        else {
          promise.resolve();
        }
      });
      return promise;
    };

    connection.on('open', function () {
      require('./app/models/user');
      var User = mongoose.model('User');
      User.seed(require('./db/seeds/user.json'))
        .then(function () {
          connection.close(done);
        });
    });
  });
};
