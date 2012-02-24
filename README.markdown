# MonitoringJS

## Introduction

This is a little sketch of a new monitoring front page tool.

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

You need to be running mcollective, and publishing registration data into
mongodb (http://projects.puppetlabs.com/projects/mcollective-plugins/wiki/AgentRegistrationMongoDB).

You need to be running mongodb in REST interface mode.

    /usr/bin/mongod --rest --config /etc/mongodb.conf

And you need the nagios-api application running:

    https://github.com/xb95/nagios-api

     python /usr/lib/nagios-api/nagios-api -p 8080 -c /var/lib/nagios3/rw/nagios.cmd -s /var/cache/nagios3/status.dat -l /var/log/nagios3/nagios.log

You should also run the included 'server' application, which will read the
nagios log and serialize it out to clients.

Assuming all these dependencies are in place, this app is as easy as
checking out the code.

Check this out, and stuff it at the web root of a vhost you serve, proxy
the above things like the following (for apache):

    # Mongodb
    ProxyPass        /puppet/  http://127.0.0.1:28017/puppet/
    ProxyPassReverse /puppet/ http://127.0.0.1:28017/puppet/
    # Nagios api
    ProxyPass        /nagios-api/ http://127.0.0.1:8080/
    ProxyPassReverse /nagios-api/ http://127.0.0.1:8080/
    # Adaptor to do MXHR/Websocket
    ProxyPass        /_hippie/ http://127.0.0.1:5000/_hippie/
    ProxyPassReverse /_hippie/ http://127.0.0.1:5000/_hippie/

### Expected collections

We expect a hostgroups collection of metadata from puppet..

XXX - FIXME with details!

## Distribution info

The entire project (excluding icon files) is inlined into index.html
in the root directory for speed of loading.

A test server and websocket server is provided in 'server', which if run
standalone on a machine without a nagios log, will run a PSGI server
hosting the application and a sensible set of demonstration data (on port
5000 by default).

The un-compacted version of the site (for debugging or development) can be viewed
using the development server at the path /dev/. This page uses the un-compacted
source located in maint/app.html, and the un-minified Javascript in the js/ directory

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
