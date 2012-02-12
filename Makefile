fatpacker.trace : test.psgi
	fatpack trace plackup test.psgi
packlists : test.psgi
	fatpack packlists-for `cat fatpacker.trace` >packlists

clean:
	rm -rf packlists fatlib fatpacker.trace
