module.exports = {
  default: {
    require: ['features/support/world.js', 'features/step_definitions/*.js'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    paths: ['features/**/*.feature'],
    publishQuiet: true,
    parallel: 1,
    retry: 0,
    timeout: 30000
  }
};