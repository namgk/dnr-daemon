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
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-chmod');
    grunt.loadNpmTasks('grunt-jsonlint');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            test : [
                "build/test"
            ]
        },
        ts: {
            default: {
                files: [
                    {
                        src: ['lib/**/*.ts'],
                        dest: 'build/dist/'
                    }
                ],
                options: {
                    module: 'commonjs',
                    target: 'es5'
                }
            },
            test : {
                options: {
                    module : "commonjs"
                },
                files: [{
                    dest: "build/test/",
                    src: [
                        "test/**/*_spec.ts"
                    ]
                }]
            }
        },
        watch: {
            files: '**/*.ts',
            tasks: ['typescript']
        },
        paths: {
            dist: ".dist"
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
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
                // http://www.jshint.com/docs/options/
                //"asi": true,      // allow missing semicolons
                //"curly": true,    // require braces
                //"eqnull": true,   // ignore ==null
                //"forin": true,    // require property filtering in "for in" loops
                //"immed": true,    // require immediate functions to be wrapped in ( )
                //"nonbsp": true,   // warn on unexpected whitespace breaking chars
                ////"strict": true, // commented out for now as it causes 100s of warnings, but want to get there eventually
                //"loopfunc": true, // allow functions to be defined in loops
                //"sub": true       // don't warn that foo['bar'] should be written as foo.bar
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
        },

        nodemon: {
            /* uses .nodemonignore */
            dev: {
                script: 'src/dnr.js',
                options: {
                    // args: nodemonArgs,
                    ext: 'js',
                    watch: [
                        'src/**/*.js'
                    ]
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.registerTask('test',
        'Runs unit tests',
        ['ts:test','simplemocha:test']);

    grunt.registerTask('dev',
        'Developer mode: run node-red, watch for source changes and build/restart',
        ['concurrent:dev']);
};