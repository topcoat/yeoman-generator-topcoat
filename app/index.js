'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


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
  '\n    |' + chalk.red('--(+)--') + '|   .--------------------------.' +
  '\n   `---------´  |    ' + chalk.yellow.bold('Welcome to Yeoman,') + '    |' +
  '\n    ' + chalk.yellow('( ') + '_' + chalk.yellow('´U`') + '_' + chalk.yellow(' )') + '   |   ' + chalk.yellow.bold('ladies and gentlemen!') + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  chalk.yellow('\n     |  ~  |') +
  '\n   __' + chalk.yellow('\'.___.\'') + '__' +
  '\n ´   ' + chalk.red('`  |') + '° ' + chalk.red('´ Y') + ' `\n';

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
    this.theme   = (/light/i).test(props.theme) ? 'topcoat-mobile-light.css' : 'topcoat-mobile-dark.css';

    cb();
  }.bind(this));
};

TopcoatGenerator.prototype.app = function app() {

  var indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  var packageFile = this.readFileAsString(path.join(this.sourceRoot(), '_package.json'));

  this.bowerInstall('topcoat');

  indexFile = indexFile.replace(/AppName/g, this.appName);
  indexFile = indexFile.replace(/css-file/g, this.theme);

  this.write('index.html', indexFile);
  this.copy('_package.json', 'package.json');
};

TopcoatGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};