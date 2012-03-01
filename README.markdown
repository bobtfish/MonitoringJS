# MonitoringJS

## Introduction

This project is a new systems monitoring dashboard.

I was sick of using an index.html which linked to nagios and munin
and puppet dashboard independently, giving me several places to
find data about my systems.

The idea is to use all my pre-existing data from mcollective and nagios,
and present it in a nice (and integrated) format, on the homepage for the
server we had the nagios & munin web interfaces on already..

This project should be considered ALPHA, whilst I have this deployed
and so won't be changing or breaking things I don't need
to, there are likely to be significant changes still.

## Features

   . Summary of nagios failures by host group
   . Host browser, with facts, classes, nagios results and integrated
     muning graphs
   . Dynamic real time updating (via MXHR)
   . Customiseable top-bar links
   . Uses localstorage to improve display performance
   . Tested and useable on Firefox, Safari, Chrome, iPhone
   . Uses Twitter's bootstrap, so doesn't make your eyes bleed.

## Quick test

Having a play around is easy - simply check out the project, then run:

    ./server

And you can browse to:

    http://localhost:5000/

The only dependency is perl >= 5.8.3 with core modules.

To test dynamic updating, add some data to the test nagios log:

    cat testdata/nagios.log.change >> testdata/nagios.log

and observe the display update.

## Screenshot

![Screenshot 1](http://bobtfish.github.com/MonitoringJS/screenshot_1.png "Screenshot 1")

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

Further instructions on setting up these dependencies are included below.

### Mcollective

You need to be running mcollective, and publishing registration data into
mongodb (http://projects.puppetlabs.com/projects/mcollective-plugins/wiki/AgentRegistrationMongoDB).

### MongoDB

You need to be running mongodb in REST interface mode.

    /usr/bin/mongod --rest --config /etc/mongodb.conf

### Nagios-api

And you need the nagios-api application from:

    https://github.com/xb95/nagios-api

And you run it something like this:

     python /usr/lib/nagios-api/nagios-api -p 8080 -c /var/lib/nagios3/rw/nagios.cmd -s /var/cache/nagios3/status.dat -l /var/log/nagios3/nagios.log

### MXHR/Websocket server

You should also run the included 'server' application, which will read the
nagios log and serialize it out to clients.

This needs to be run as a user who can read the nagios log file (which is expected to be in /var/log/nagios3/nagios.log)

### Expected mongodb collections

Certain mongodb collections are expected to be populated as documented below.

All example code uses the functions from:

    https://github.com/richardc/puppet-mongodb_functions

to populate mongodb. Expected collections are documented below.

#### nagios_host_groups

    define hostgroup {
        $mdsn = { database => "puppet", collection => "nagios_host_groups" }
        $document = {
            "_id" => "${fqdn}_${name}",
            fqdn => $fqdn,
            group_name => $name,
        }
        mongodb_save( $mdsn, $document )
    }

And then in your manifests, or your own puppet modules, you can say something like:

    hostgroup { "web-servers": }

This metadata is used by the dashboard for grouping, and is also used in the puppet manifests for my nagios
server to generate per-host configs with them belonging to the correct group(s).

### Other setup

Copy testdata/topbar.json into the root directory, and customise to give you the elements you want in your
main navigation menu.

## Distribution info

The entire project (excluding icon files) is inlined into index.html
in the root directory for speed of loading.

A test server and MXHR update server is provided in 'server', which if run
hosts the application and a sensible set of demonstration data (on port
5000 by default).

For production installs, this server is used as the asynchronous server, and is
proxied to under a subset of the URI space, as documented above.

The un-compacted version of the site (for debugging or development) can be viewed
using the development server at the path /dev/. This page uses the un-compacted
source located in /maint/app.html, and the un-minified Javascript in the js/ directory

If you have made changes, and would like to re-build the inlined versions of the
application server and/or index.html, then see the README in the maint/
directory.

# AUTHOR

Tomas Doran (t0m) <bobtfish@bobtfish.net>

# COPYRIGHT AND LICENSE

The code with specific copyright and license inside files is copyright
and licensed to those authors.

All other code is copyright Tomas Doran, and licensed as per perl 5
(choice of GPLv2 or artistic). If this is a problem for you, please email
me as I would have no objection to re-licensing in a less restrictive way.
