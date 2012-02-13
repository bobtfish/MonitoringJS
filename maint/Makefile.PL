#!/usr/bin/env perl
use strict;
use warnings;
use FindBin qw/$Bin/;
use File::Spec;

# Hand generates Makefile

open(my $OUTFILE, '>', File::Spec->catdir($Bin, 'Makefile'))
    or die("Could not write Makefile: $!");

print $OUTFILE qq{
all : server

fatpacker.trace : test.psgi
\tfatpack trace test.psgi
packlists : fatpacker.trace
\tfatpack packlists-for `cat fatpacker.trace` >packlists
fatlib: packlists
\tfatpack tree `cat packlists`
fatpacked_deps.pl: fatlib
\tfatpack file > fatpacked_deps.pl
server : fatpacked_deps.pl
\techo "#!/usr/bin/env perl" > server
\tcat fatpacked_deps.pl test.psgi >>server
\tchmod 755 server
\tcp server ../server

clean:
\trm -rf fatpacked_deps.pl server packlists fatlib fatpacker.trace
};
close($OUTFILE);
