module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');
  var chrome_mnf = grunt.file.readJSON('code/chrome.json');
  var firefox_pkg = grunt.file.readJSON('code/firefox.json');

  var fileMaps = { browserify: {}, uglify: {} };
  var file, files = grunt.file.expand({cwd:'code/js'}, ['*.js', 'libs/*.js', 'chrome/*.js']);
  for (var i = 0; i < files.length; i++) {
    file = files[i];
    fileMaps.browserify['build/unpacked-dev/js/' + file] = 'code/js/' + file;
    if (file.indexOf('libs/') === -1) {
      fileMaps.uglify['build/unpacked-prod/js/' + file] = 'build/unpacked-dev/js/' + file;
    }
  }

  //
  // config
  //

  grunt.initConfig({

    clean: ['build/unpacked-dev', 'build/unpacked-prod', 'build/*.crx'],

    mkdir: {
      unpacked: { options: { create: ['build/unpacked-dev', 'build/unpacked-prod'] } },
      js: { options: { create: ['build/unpacked-dev/js'] } }
    },

    jshint: {
      options: grunt.file.readJSON('lint-options.json'), // see http://www.jshint.com/docs/options/
      all: { src: ['package.json', 'lint-options.json', 'Gruntfile.js', 'code/**/*.js',
                   'code/**/*.json', '!code/js/libs/*'] }
    },

    copy: {
      main: { files: [ {
        expand: true,
        cwd: 'code/',
        src: ['**', '!js/**', '!**/*.md'],
        dest: 'build/unpacked-dev/'
      } ] },
      prod: { files: [ {
        expand: true,
        cwd: 'build/unpacked-dev/',
        src: ['**', '!js/*.js'],
        dest: 'build/unpacked-prod/'
      } ] },
      artifact: { files: [ {
        expand: true,
        cwd: 'build/',
        src: [pkg.name + '-' + pkg.version + '.crx'],
        dest: process.env.CIRCLE_ARTIFACTS
      } ] }
    },

    browserify: {
      build: {
        files: fileMaps.browserify,
        options: { bundleOptions: {
          debug: true,  // for source maps
          standalone: pkg['export-symbol']
        } }
      }
    },

    exec: {
      crx: {
        cmd: [
          './crxmake.sh build/unpacked-prod ./mykey.pem',
          'mv -v ./unpacked-prod.crx "build/' + pkg.name + '-' + pkg.version + '.crx"',
          '(cd build && zip -r "' + pkg.name + '-' + pkg.version + '.zip" unpacked-prod)'
        ].join(' && ')
      },
      xpi: {
        cmd: [
          'cp code/js/firefox/main.js build/firefox/index.js',
          'rm -rf build/firefox/data', 'mkdir build/firefox/data',
          'cp -R code/js/libs build/firefox/data',
          'cp code/js/content.js build/firefox/data/content.js',
          'cp code/images/* build/firefox/data/',
          'cp code/html/* build/firefox/data/',
          'cp code/css/* build/firefox/data/',
          '(cd build/firefox && ../../node_modules/jpm/bin/jpm xpi)',
          'mv build/firefox/github-awesome-autocomplete@algolia.com.xpi build/'
        ].join(' && ')
      }
    },

    uglify: {
      min: { files: fileMaps.uglify }
    },

    watch: {
      js: {
        files: ['package.json', 'lint-options.json', 'Gruntfile.js', 'code/**/*.js',
                'code/**/*.json', '!code/js/libs/*', 'code/**/*.sass', 'code/**/*.html'],
        tasks: ['default']
      }
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'code/css/content.css': 'code/scss/content.sass'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  //
  // custom tasks
  //

  grunt.registerTask('chrome-manifest',
    'Extend manifest.json with extra fields from package.json',
    function() {
      var fields = ['version', 'description'];
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        chrome_mnf[field] = pkg[field];
      }
      grunt.file.write('build/unpacked-dev/manifest.json', JSON.stringify(chrome_mnf, null, 4) + '\n');
      grunt.log.ok('chrome\'s manifest.json generated');
    }
  );

  grunt.registerTask('firefox-package',
    'Build Firefox\'s package.json file',
    function() {
      var fields = ['version', 'description', 'name', 'title', 'homepage'];
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        firefox_pkg[field] = pkg[field];
      }
      grunt.file.write('build/firefox/package.json', JSON.stringify(firefox_pkg, null, 4) + '\n');
      grunt.log.ok('firefox\'s package.json generated');
    }
  );

  //
  // testing-related tasks
  //

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('test-cont', ['default', 'watch']);
  grunt.registerTask('dev', ['test-cont']);

  //
  // DEFAULT
  //

  grunt.registerTask('default', ['clean', 'test', 'sass', 'mkdir:unpacked', 'copy:main', 'chrome-manifest', 'firefox-package',
    'mkdir:js', 'browserify', 'copy:prod', 'uglify', 'exec']);

};
