module.exports = function(grunt){
    (require('load-grunt-tasks'))(grunt);
    grunt.registerTask('serve',['connect:server']);
    grunt.registerTask('build',['clean','bower','concurrent:build']);
    grunt.registerTask('default',['build','concurrent:mini']);
    grunt.registerTask('all',['bower','default']);
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        clean:{
            build:{
                src:['build/']
            }
        },
        bower: {
            install:{
                options:{
                    targetDir: 'build/lib',
                    cleanTargetDir:true
                }
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: true
            },
            lint: ['Gruntfile.js', 'src/scripts/**/*.js']
        },
        cssmin:{
            combine:{
                files:{
                    'build/css/lib.min.css': ['build/lib/**/*.css'],
                    'build/css/all.min.css':['src/**/*.css']
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: 'JST'
                },
                files: {
                    'build/js/compiled_templates.js': ['src/templates/**/application.hbs']
                }
            }
        },
        uglify:{
            options:{
                mangle:false,
                verbose:true
            },
            lib:{
                files:{
                    'build/js/lib.min.js':['build/lib/jquery/jquery.js','build/lib/bootstrap/bootstrap.js','build/lib/handlebars/handlebars.js','build/lib/ember/ember.js', 'build/lib/lodash/lodash.compat.js']
                }
            }
        },
        concat:{
            dist:{
                src: ['src/scripts/**/src.js','src/scripts/**/!(src)*.js'],
                dest: 'build/js/all.min.js'
            }

        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    keepalive: true,
                    livereload: true,
                    base: ['build/html', 'build/js', 'build/css', 'src/', 'src/scripts', 'src/styles']
                }
            }
        },
        watch: {
            jsfiles: {
                files: ['src/scripts/**/*.js'],
                tasks: ['jshint']
            },
            handlebars:{
                files: ['src/templates/**/*.hbs'],
                tasks:['handlebars']
            },
            htmlCssJs: {
                files: ['src/scripts/**/*.js', 'src/**/*.html', 'src/**/*.css'],
                tasks: ['cssmin','concat']
            },
            options: {
                spawn: true,
                livereload: true
            }
        },
        concurrent: {
            build: ['newer:cssmin', 'newer:uglify', 'newer:handlebars', 'newer:jshint','newer:concat'],
            mini: ['serve', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });
};