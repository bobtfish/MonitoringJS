
PERL = perl "-Iinc"
FULLPERL = perl "-Iinc"
ABSPERL = $(PERL)
PERLRUN = $(PERL)
FIRST_MAKEFILE = Makefile
MAKEFILE_OLD = Makefile.old
NOECHO = @
ECHO = echo
MV = mv
DEV_NULL = > /dev/null 2>&1
FALSE = false

all : server all.min.js $(FIRST_MAKEFILE)

# --- MakeMaker makefile section:
# We take a very conservative approach here, but it's worth it.
# We move Makefile to Makefile.old here to avoid gnu make looping.
$(FIRST_MAKEFILE) : Makefile.PL
	$(NOECHO) $(ECHO) "Makefile out-of-date with respect to $?"
	$(NOECHO) $(ECHO) "Cleaning current config before rebuilding Makefile..."
	-$(NOECHO) $(RM_F) $(MAKEFILE_OLD)
	-$(NOECHO) $(MV)   $(FIRST_MAKEFILE) $(MAKEFILE_OLD)
	- $(MAKE) $(USEMAKEFILE) $(MAKEFILE_OLD) clean $(DEV_NULL)
	$(PERLRUN) Makefile.PL
	$(NOECHO) $(ECHO) "==> Your Makefile has been rebuilt. <=="
	$(NOECHO) $(ECHO) "==> Please rerun the $(MAKE) command.  <=="
	$(FALSE)


fatpacker.trace : test.psgi
	$(NOECHO) perl -MCwd -e1
	$(NOECHO) perl -MPlack -e1
	$(NOECHO) perl -e'use App::FatPacker ();'
	fatpack trace test.psgi
packlists : fatpacker.trace
	fatpack packlists-for `cat fatpacker.trace` >packlists
fatlib: packlists
	fatpack tree `cat packlists`
fatpacked_deps.pl: fatlib
	fatpack file > fatpacked_deps.pl 2>/dev/null
server : fatpacked_deps.pl
	$(NOECHO) echo "#!/usr/bin/env perl" > server
	cat fatpacked_deps.pl test.psgi >>server
	chmod 755 server
	$(NOECHO) cp server ../server

all.min.js : app.html ../js/*.js ../js/app/*.js ../js/app/collection/*.js ../js/app/model/*.js ../js/app/view/*.js
	perl concatjs.pl

clean:
	rm -rf fatpacked_deps.pl server packlists fatlib fatpacker.trace all.js all.min.js ../server ../index.html
