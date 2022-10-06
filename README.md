# Dart Full Coverage

![npm](https://img.shields.io/npm/v/@stelynx/dart-full-coverage)
![GitHub](https://img.shields.io/github/license/stelynx/dart-full-coverage)

Coverage tools like _codecov_ only see the files that were actually triggered by tests. This means
that a coverage of 100% can easily be a lie, e.g. you can just write a dummy test that does not import
any files and a coverage tool will ignore all the code base.

Luckily, this action resolves this problem.

## How it works

The _Dart Full Coverage_ action harvests the power of Bash to find all files in specified directory, by
default it is `lib` directory, where all Flutter files are. It then creates a dummy test file
`test/coverage_helper_test.dart` that imports all the Dart files that were found and has an empty `void main() {}`
function so that it actually starts.

## Using the action

Action has four parameters:

- `package`: The name of your package, the same as you use in imports, e.g. if you import files like
  `import "package:egakcap/some_file.dart";`, then package is `'egakcap'`. This parameter is required.
- `use_git_root`: Boolean, whether to `cd` into `$GITHUB_WORKSPACE` at the beginning of the script or not. Defaults to true, set `use_git_root: false` to negate.
- `main_dir`: If `use_git_root` is set to `false`, you can provide the starting directory where the script should `cd` to. If `use_git_root` is set to `false` and you omit this value, the active directory will not be changed.
- `path`: The relative path to Dart files, by default it is `'lib'`. Path is relative to either `$GITHUB_WORKSPACE`, or provided directory in `main_dir`, or to the directory the action is being executed in.
- `test_file`: The name of the dummy file the script will create. The name should lead to where your tests are. The default value is `'test/coverage_helper_test.dart'`.
- `ignore`: A comma-separated list of files to be ignored and not imported in `test_file`. For example, if you want to skip all files that end with "\_state.dart" or the file is called "do_not_import_me.dart", then set `ignore` to `'*_state.dart, do_not_import_me.dart'`. By default, none of the files will be ignored.

So, a typical usage of this action would be similar to the following.

```yaml
name: "test"
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-java@v1
        with:
          java-version: "12.x"
      - uses: subosito/flutter-action@v1
        with:
          channel: "stable"
      - uses: stelynx/dart-full-coverage@v1.1.1
        with:
          package: egakcap
          ignore: "*_state.dart, do_not_import_me.dart"
      - run: flutter pub get
      - run: flutter packages pub run build_runner build
      - run: flutter build aot
      - run: flutter analyze
      - run: flutter test --coverage .
      - uses: codecov/codecov-action@v1.0.2
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

## Contributing

Every contribution is very welcome! Please, see the [CONTRIBUTING guidlines](CONTRIBUTING.md).
