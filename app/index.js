'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var TopcoatGenerator = module.exports = function TopcoatGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(TopcoatGenerator, yeoman.generators.NamedBase);

TopcoatGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

  console.log(welcome);

  var prompts = [{
    name: 'appName',
    message: 'What is the name of your application?',
    default: 'app'
  },
  {
    name: 'theme',
    message: 'Choose a theme',
    default: 'light/dark'
  }
  ];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.appName = props.appName;
    this.theme   = (/light/i).test(props.theme) ? 'light' : 'dark';

    cb();
  }.bind(this));
};

TopcoatGenerator.prototype.app = function app() {

  var indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  var packageFile = this.readFileAsString(path.join(this.sourceRoot(), '_package.json'));

  if (this.theme === 'light') {
    this.copy('css/topcoat-mobile-light.min.css', 'css/topcoat-mobile-light.min.css');
    indexFile = indexFile.replace('css-file', 'css/topcoat-mobile-light.min.css');
  } else {
    this.copy('css/topcoat-mobile-dark.min.css', 'css/topcoat-mobile-dark.min.css');
    indexFile = indexFile.replace('css-file', 'css/topcoat-mobile-dark.min.css');
  }

  indexFile = indexFile.replace(/AppName/g, this.appName);

  this.write('index.html', indexFile);
  this.copy('_package.json', 'package.json');
};

TopcoatGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};