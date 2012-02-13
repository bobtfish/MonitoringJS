#!/usr/bin/env perl

use strict;
use warnings;
use FindBin qw/$Bin/;
use Cwd qw/ abs_path /;
use File::Spec;

use Plack::Runner;
use Plack::App::File;
use Plack::Builder;
use Plack::Loader;
use HTTP::Server::PSGI;
use Cwd qw/ abs_path /;

use constant ROOT =>
    abs_path(
        -d File::Spec->catdir($Bin, "js")
        ? $Bin
      : -d File::Spec->catdir($Bin, "..", "js")
        ? File::Spec->catdir($Bin, "..")
      : die("Cannot find js/ folder for app root")
    );

warn ROOT;
sub file {
    Plack::App::File->new(file => File::Spec->catdir(ROOT, @_))
}

my $app = builder {
    mount "/favicon.ico"                => file("favicon.ico");
    mount "/puppet/nodes/"              => file(qw/testdata nodes.json/);
    mount "/puppet/nagios_host_groups/" => file(qw/testdata nagios_host_groups.json/);
    mount "/nagios-api/state"           => file(qw/testdata nagios-api-state.json/);
    mount "/"                           => file("index.html");
    mount "/dev"                        => file("maint", "app.html");
    mount "/js"                         => Plack::App::File->new(root => File::Spec->catdir(ROOT, "js"));
    mount "/css"                        => Plack::App::File->new(root => File::Spec->catdir(ROOT, "css"));
    mount "/img"                        => Plack::App::File->new(root => File::Spec->catdir(ROOT, "img"));
    mount "/test"                       => file(qw/test index.html/);
    mount "/test/vendor/qunit.js"       => file(qw/test vendor qunit.js/);
    mount "/test/vendor/qunit.css"      => file(qw/test vendor qunit.css/);
    mount "/test/model.js"              => file(qw/test model.js/);
    mount "/test/collections.js"        => file(qw/test collections.js/);
};

# Use Plack::Runner here so we can be directly run with perl
unless (caller()) {
    my $runner = Plack::Runner->new;
    $runner->parse_options(@ARGV);
    $runner->run($app);
}

return $app;

