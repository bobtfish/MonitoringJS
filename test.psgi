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
    mount "/" => Plack::App::File->new(file => "$Bin/test.html");
    mount "/js" => Plack::App::File->new(root => "$Bin/js");
    mount "/css" => Plack::App::File->new(root => "$Bin/css");
};

