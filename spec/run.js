import Jasmine from 'jasmine';
import Reporter from 'jasmine-console-reporter';
const jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/jasmine.json');
//jasmine.jasmine.getEnv().addReporter(new Reporter());
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
console.log("Running tests with timeout : ", jasmine.DEFAULT_TIMEOUT_INTERVAL)
jasmine.execute();