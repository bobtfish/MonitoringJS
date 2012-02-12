all : server

fatpacker.trace : test.psgi
	fatpack trace test.psgi
packlists : fatpacker.trace
	fatpack packlists-for `cat fatpacker.trace` >packlists
fatlib: packlists
	fatpack tree `cat packlists`
fatpacked_deps.pl: fatlib
	fatpack file > fatpacked_deps.pl
server : fatpacked_deps.pl
	echo "#!/usr/bin/env perl" > server
	cat fatpacked_deps.pl test.psgi >>server
	chmod 755 server
	cp server ../server

clean:
	rm -rf fatpacked_deps.pl server packlists fatlib fatpacker.trace
