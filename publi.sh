#!/bin/bash -xe

echo "App = typeof App === 'undefined' ? {}:App; App.version = '$(date +%y.%m.%d-%H:%M:%S)';" > ./lib/_version_.js

if [ -z "$1" ] ; then
	DST="staging"
else
	DST=$1
fi

git add . --all
git commit -a
git push origin master

# git push origin master:$DST

# openshift app name
APP_NAME="dictapp"

# demeteorize
rm .demeteorized -r
demeteorizer -n 0.10.5

# clear openshift folder
rm .openshift/$APP_NAME/programs -rf
rm .openshift/$APP_NAME/server -rf

# move folders
mv -fv .demeteorized/programs .openshift/$APP_NAME
mv -fv .demeteorized/server .openshift/$APP_NAME

# commit & deploy openshift app
cd .openshift/$APP_NAME
git add . --all
git commit -a -m "deploying"
git push
