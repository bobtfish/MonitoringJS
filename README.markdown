# MonitoringJS

## Introduction

This is a little sketch of a new monitoring front page dashboard.

The idea is to use all my pre-existing data from mcollective and nagios,
and present it in a nice (and integrated) format.

This project should be considered PRE ALPHA. Everything is liable to
change.

## Quick test

Check out the project

Run ./server

Browse to http://localhost:5000/

## Production install

### Dependencies

This application has a number of dependencies on your infrastructure, however the app itself
is almost entirely written in Javascript, with a tiny server for push notifications
of nagios server updates.

Installing is a simple as checking the project out at your web root, and setting up mod_proxy (or similar,
Apache is illustrated in the documentation, but not required) to proxy the JSON APIs that this application needs.

An example Apache config snippet for setting up mod_proxy is shown below.

    # Mongodb
    ProxyPass        /puppet/  http://127.0.0.1:28017/puppet/
    ProxyPassReverse /puppet/ http://127.0.0.1:28017/puppet/
    # Nagios api
    ProxyPass        /nagios-api/ http://127.0.0.1:8080/
    ProxyPassReverse /nagios-api/ http://127.0.0.1:8080/
    # 'server' Adaptor to do MXHR/Websocket
    ProxyPass        /_hippie/ http://127.0.0.1:5000/_hippie/
    ProxyPassReverse /_hippie/ http://127.0.0.1:5000/_hippie/

Further instructions on setting up the dependencies are included below.

### Mcollective

You need to be running mcollective, and publishing registration data into
mongodb (http://projects.puppetlabs.com/projects/mcollective-plugins/wiki/AgentRegistrationMongoDB).

### MongoDB

You need to be running mongodb in REST interface mode.

    /usr/bin/mongod --rest --config /etc/mongodb.conf

### Nagios-api

And you need the nagios-api application running:

    https://github.com/xb95/nagios-api

     python /usr/lib/nagios-api/nagios-api -p 8080 -c /var/lib/nagios3/rw/nagios.cmd -s /var/cache/nagios3/status.dat -l /var/log/nagios3/nagios.log

### MXHR/Websocket server

You should also run the included 'server' application, which will read the
nagios log and serialize it out to clients.

This needs to be run as a user who can read the nagios log file (which is expected to be in /var/log/nagios3/nagios.log)

### Expected collections

We expect a nagios_host_groups collection of metadata from puppet..

XXX - FIXME with details!

### Other setup

Copy testdata/topbar.json into the root directory, and customise to give you the elements you want in your
main navigation menu.

## Distribution info

The entire project (excluding icon files) is inlined into index.html
in the root directory for speed of loading.

A test server and websocket server is provided in 'server', which if run
standalone on a machine without a nagios log, will run a PSGI server
hosting the application and a sensible set of demonstration data (on port
5000 by default).

The un-compacted version of the site (for debugging or development) can be viewed
using the development server at the path /dev/. This page uses the un-compacted
source located in /maint/app.html, and the un-minified Javascript in the js/ directory

To re-build the inlined versions of the application, see instructions in the maint/
directory.

# AUTHOR

Tomas Doran (t0m) <bobtfish@bobtfish.net>

# COPYRIGHT AND LICENSE

The code with specific copyright and license inside files is copyright
and licensed to those authors.

All other code is copyright Tomas Doran, and licensed as per perl 5
(choice of GPLv2 or artistic). If this is a problem for you, please email
me as I would have no objection to re-licensing in a less restrictive way.
