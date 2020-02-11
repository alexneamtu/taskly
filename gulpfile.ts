// npm
import * as gulp from 'gulp';
import * as eslint from 'gulp-eslint';
import jest from 'gulp-jest';
import * as shell from 'gulp-shell';
import * as tsc from 'gulp-typescript';

const tsProject = tsc.createProject('./tsconfig.json');

/**
 * Compiles the Typescript code.
 */
gulp.task(
  'compile',
  () => tsProject.src().pipe(tsProject()),
);

/**
 * Lint task. It uses TSLint with Airbnb config (defined in tslint.json)
 */
gulp.task('lint', () => {
  // files to lint
  const files = [
    // Ignore node_modules
    '!node_modules/**',

    // Code coverage files
    '!coverage/**',

    // ts-node generated stuff
    '!ts-node*/**',

    // Process all typescript
    '**/*.ts',
  ];

  return gulp.src(files)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


/**
 * Runs the jest test.
 */
gulp.task('jest', shell.task(['jest']));

/**
 * The test task
 */
gulp.task('test', gulp.series('compile', 'lint', 'jest'));
