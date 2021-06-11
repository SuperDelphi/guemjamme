![Guemjamme](https://user-images.githubusercontent.com/44942598/121183900-d6be1b80-c864-11eb-9491-651835ae6d04.png)

Guemjamme 2021 takes place here and now!

# Installation

This project requires NodeJS (with NPM installed).
For the first installation, you need to execute ``npm install`` in order to install the NPM modules used in the project.

After editing the JavaScript files, you need to use Borwserify to bundle those.
In order to do that, you need to execute ``browserify input-file -o output-file``, where ``input-file`` is to be replaced by each JavaScript file contained in the ``js/client/`` folder (the output file name is the same as the original name, with "_bundle" added as a suffix, in the same folder).
