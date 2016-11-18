/**
 * Copyright 2013, 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var path = require("path");

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // grunt.event.on('watch', function(action, filepath) {
  //   if (filepath.indexOf('src') != -1)
  //     grunt.config('ts.src.files.src', filepath);
  //   if (filepath.indexOf('test') != -1)
  //     grunt.config('ts.test.files.src', filepath);
  // });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
        build: {
            tasks: ['ts:src', 'ts:test'],
            options: {
                logConcurrentOutput: true
            }
        }
    },
    clean: {
      all : [
        "build/",
        "src/**/*.js",
        "test/**/*.js"
      ]
    },
    ts: {
      all: {
        options: {
          fast: "never",
          module: 'commonjs',
          target: 'es5',
        },
        files:{
          'build/': ['src/**/*.ts', 'test/**/*.ts']
        }
      }
    },
    watch: {
      files: '**/*.ts',
      tasks: ['test']
    },
    paths: {
      dist: ".dist"
    },
    simplemocha: {
      options: {
        globals: ['expect'],
        timeout: 5000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'mochawesome',
        reporterOptions: {
          reportDir: 'test-report',
          reportName: 'dnr tests',
          reportTitle: 'DNR Tests'
        }
      },
      test: { src: ["build/test/*_spec.js"]}
    },
    jshint: {
      options: {
        jshintrc:true
      },
      all: [
        'Gruntfile.js',
        'src/**/*.js'
      ],
      tests: {
        files: {
          src: ['test/**/*.js']
        },
        options: {
					"expr": true
        }
      }
    }
  });
  
  grunt.registerTask('test',
    'Runs unit tests',
    ['build','simplemocha:test']);

  grunt.registerTask('dev',
    'Developer mode: run node-red, watch for source changes and build/restart',
    ['concurrent:dev']);

  grunt.registerTask('build',
    'Compile typescript',
    ['ts']);

};