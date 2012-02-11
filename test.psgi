#!/usr/bin/env perl

use strict;
use warnings;
use FindBin qw/$Bin/;

use Plack::App::File;
use Plack::Builder;

builder {
    mount "/favicon.ico" => Plack::App::File->new(file => "$Bin/favicon.ico");
    mount "/puppet/nodes/" => Plack::App::File->new(file => "$Bin/testdata/nodes.json");
    mount "/nagios-api/state" => Plack::App::File->new(file => "$Bin/testdata/nagios-api-state.json");
    mount "/" => Plack::App::File->new(file => "$Bin/index.html");
    mount "/js" => Plack::App::File->new(root => "$Bin/js");
    mount "/css" => Plack::App::File->new(root => "$Bin/css");
    mount "/img" => Plack::App::File->new(root => "$Bin/img");
    mount "/test" => Plack::App::File->new(file => "$Bin/test/index.html");
    mount "/test/vendor/qunit.js" => Plack::App::File->new(file => "$Bin/test/vendor/qunit.js");
    mount "/test/vendor/qunit.css" => Plack::App::File->new(file => "$Bin/test/vendor/qunit.css");
    mount "/test/model.js" => Plack::App::File->new(file => "$Bin/test/model.js");
    mount "/test/collections.js" => Plack::App::File->new(file => "$Bin/test/collections.js");
};

