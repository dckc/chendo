## unit testing with yarn

`yarn test`

## ES-6 Modules

type `module` in `package.json`

## format-on-save

using agoric-sdk/scripts/configure-vscode.sh

## bleeding-edge endo

```
git checkout kris-daemon-worker-endowments

2022-12-27 20:55 c339e96ec feat(cli): Inbox, resolve, and reject commands
```

```diff
$ git diff
diff --git a/packages/cli/package.json b/packages/cli/package.json
index 95600e007..3f3f42204 100644
--- a/packages/cli/package.json
+++ b/packages/cli/package.json
@@ -14,6 +14,9 @@
     "url": "https://github.com/endojs/endo/issues"
   },
   "type": "module",
+  "bin": {
+    "endo": "bin/endo"
+  },
   "exports": {},
   "scripts": {
     "build": "exit 0",
```

```
12:12 connolly@bldbox$ yarn link @endo/cli
yarn link v1.22.19
warning package.json: No license field
error No registered package found called "@endo/cli".
info Visit https://yarnpkg.com/en/docs/cli/link for documentation about this command.
~/projects/chendo
12:13 connolly@bldbox$ pushd ../endo/packages/cli
~/projects/endo/packages/cli ~/projects/chendo
~/projects/endo/packages/cli
12:13 connolly@bldbox$ yarn link
yarn link v1.22.0
success Registered "@endo/cli".
info You can now run `yarn link "@endo/cli"` in the projects where you want to use this package and it will be used instead.
Done in 0.03s.
~/projects/endo/packages/cli
12:13 connolly@bldbox$ popd
~/projects/chendo
~/projects/chendo
12:13 connolly@bldbox$ yarn link @endo/daemon
yarn link v1.22.19
warning package.json: No license field
error No registered package found called "@endo/daemon".
info Visit https://yarnpkg.com/en/docs/cli/link for documentation about this command.
~/projects/chendo
12:13 connolly@bldbox$ pushd ../endo/packages/daemon/
~/projects/endo/packages/daemon ~/projects/chendo
~/projects/endo/packages/daemon
12:13 connolly@bldbox$ yarn link
yarn link v1.22.0
success Registered "@endo/daemon".
info You can now run `yarn link "@endo/daemon"` in the projects where you want to use this package and it will be used instead.
Done in 0.03s.
```

```
alias endo='yarn --silent endo'
```

## Our first endo plugin: tmpfs

```
~/projects/chendo
12:36 connolly@bldbox$ endo reset
~/projects/chendo
12:36 connolly@bldbox$ endo spawn tmpfile
~/projects/chendo
12:36 connolly@bldbox$ endo import-unsafe0 tmpfile src/file-plugin.js -n tmpfs
Object [Alleged: Files] {}
12:37 connolly@bldbox$ date >/tmp/f1
~/projects/chendo
12:38 connolly@bldbox$ endo eval tmpfile 'E(tmpfs).readTmp("f1")' tmpfs
Sat Mar 25 12:37:12 PM CDT 2023
```
