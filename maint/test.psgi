#!/usr/bin/env perl

use strict;
use warnings;
use FindBin qw/$Bin/;
use Plack::Runner;
use Plack::App::File;
use Plack::Builder;
use Plack::Loader;
use HTTP::Server::PSGI;

our $psgi_bin ||= $Bin;

sub file { Plack::App::File->new(file => "$psgi_bin/../" . shift()) }

my $app = builder {
    mount "/favicon.ico" => file("../favicon.ico");
    mount "/puppet/nodes/" => file("testdata/nodes.json");
    mount "/puppet/nagios_host_groups/" => file("testdata/nagios_host_groups.json");
    mount "/nagios-api/state" => file("testdata/nagios-api-state.json");
    mount "/" => file("../index.html");
    mount "/js" => Plack::App::File->new(root => "$psgi_bin/js");
    mount "/css" => Plack::App::File->new(root => "$psgi_bin/css");
    mount "/img" => Plack::App::File->new(root => "$psgi_bin/img");
    mount "/test" => file("../test/index.html");
    mount "/test/vendor/qunit.js" => file("/test/vendor/qunit.js");
    mount "/test/vendor/qunit.css" => file("/test/vendor/qunit.css");
    mount "/test/model.js" => file("/test/model.js");
    mount "/test/collections.js" => file("/test/collections.js");
};

# Use Plack::Runner here so we can be directly run with perl
unless (caller()) {
    my $runner = Plack::Runner->new;
    $runner->parse_options(@ARGV);
    $runner->run($app);
}

return $app;

