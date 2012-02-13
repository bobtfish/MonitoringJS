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
use File::stat;
use File::Find;

# Work out where the root is, no matter where we were run
use constant ROOT =>
    abs_path(
        -d File::Spec->catdir($Bin, "js")
        ? $Bin
      : -d File::Spec->catdir($Bin, "..", "js")
        ? File::Spec->catdir($Bin, "..")
      : die("Cannot find js/ folder for app root")
    );

# Find the newest js or CSS file's mtime
my $youngest = 0;
my $wanted = sub {
    my $time = stat($File::Find::name)->mtime;
    $youngest = $time if $time > $youngest;
};
find($wanted, map { File::Spec->catdir(ROOT, $_) } qw/ js css /);
{   # Find app.html's mtime
    local $File::Find::name = File::Spec->catdir(ROOT, "maint", "app.html");
    $wanted->();
}

# Find mtime for minified version
my $minified_mtime = stat(File::Spec->catdir(ROOT, 'index.html'))->mtime;

# And use the minified version if possible, or the multi-file version if
# the application has been edited.
my @index = $minified_mtime > $youngest ? ("index.html") : ("maint", "app.html");

# Helper function to locate a file
sub file {
    Plack::App::File->new(file => File::Spec->catdir(ROOT, @_))
}

# Build the app coderef
my $app = builder {
    mount "/favicon.ico"                => file("favicon.ico");
    mount "/puppet/nodes/"              => file(qw/testdata nodes.json/);
    mount "/puppet/nagios_host_groups/" => file(qw/testdata nagios_host_groups.json/);
    mount "/nagios-api/state"           => file(qw/testdata nagios-api-state.json/);
    mount "/"                           => file(@index);
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
# as a perl script. The caller magic also allows us to be used
# as a psgi script, as we don't run anything when require'd
unless (caller()) {
    my $runner = Plack::Runner->new;
    $runner->parse_options(@ARGV);
    $runner->run($app);
}

# And return the app as the final value to be a valid psgi.
return $app;

