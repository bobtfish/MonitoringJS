#!/usr/bin/env perl
use strict;
use warnings;
use FindBin qw/$Bin/;
use File::Spec;
# Hand generates Makefile


open(my $OUTFILE, '>', File::Spec->catdir($Bin, 'Makefile'))
    or die("Could not write Makefile: $!");

my $jslist = join(" ", split(/\n/, `find ../js -name \\*.js | grep -v all.min.js`));

# Re-generate Makefile if Makefile.PL updated hack
print $OUTFILE qq{
PERL = perl "-Iinc"
FULLPERL = perl "-Iinc"
}.q{ABSPERL = $(PERL)
PERLRUN = $(PERL)
FIRST_MAKEFILE = Makefile
MAKEFILE_OLD = Makefile.old
NOECHO = @
ECHO = echo
MV = mv
DEV_NULL = > /dev/null 2>&1

all : server all.min.js $(FIRST_MAKEFILE)

# --- MakeMaker makefile section:
# We take a very conservative approach here, but it's worth it.
# We move Makefile to Makefile.old here to avoid gnu make looping.
$(FIRST_MAKEFILE) : Makefile.PL
}.qq{\t}.q{$(NOECHO) $(ECHO) "Makefile out-of-date with respect to $?"
}.qq{\t}.q{$(NOECHO) $(ECHO) "Cleaning current config before rebuilding Makefile..."
}.qq{\t}.q{-$(NOECHO) $(RM_F) $(MAKEFILE_OLD)
}.qq{\t}.q{-$(NOECHO) $(MV)   $(FIRST_MAKEFILE) $(MAKEFILE_OLD)
}.qq{\t}.q{- $(MAKE) $(USEMAKEFILE) $(MAKEFILE_OLD) clean $(DEV_NULL)
}.qq{\t}.q{$(PERLRUN) Makefile.PL
}.qq{\t}.q{$(NOECHO) $(ECHO) "==> Your Makefile has been rebuilt. <=="
}.qq{\t}.q{$(NOECHO) $(ECHO) "==> Please rerun the $(MAKE) command.  <=="
}.qq{\t}.q{$(FALSE)

}.qq{
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

all.js : $jslist
\tperl concatjs.pl

all.min.js : all.js
\tjava -jar yuicompressor-2.3.6.jar all.js -o all.min.js
\tcp all.min.js ../js

clean:
\trm -rf fatpacked_deps.pl server packlists fatlib fatpacker.trace all.js ../js/all.min.js ../index.html
};
close($OUTFILE);

