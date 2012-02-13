#!/usr/bin/env perl
use strict;
use warnings;
use File::Spec;
use FindBin qw/ $Bin /;
use HTML::TreeBuilder;
use JavaScript::Minifier qw/minify/;

my $tree = HTML::TreeBuilder->new;
$tree->parse_file(File::Spec->catdir($Bin, 'index.html'));
my @nodes = $tree->look_down(
    "_tag" => "script",
    sub { $_[0]->attr('src') && $_[0]->attr('src') =~ /js$/ }
);
my @js = map { $_->attr('src') } @nodes;

my $out = '';
foreach my $js (@js) {
    open(my $INFILE, '<', File::Spec->catdir($Bin, '..', $js))
        or die "Could not open $js: $!";;
    my $in = do { local $/; <$INFILE> };
    close($INFILE);
    $out .= $in;
}
open(my $OUTJS, '>', File::Spec->catdir($Bin, '..', "js", "all.min.js"))
    or die("Could not write all.js");
print $OUTJS $out;
close($OUTJS);

$nodes[0]->preinsert(HTML::Element->new('script', src => '/js/all.min.js'));
$_->detach for @nodes;

open(my $OUTHTML, '>', File::Spec->catdir($Bin, '..', "index.html"))
    or die("Could not write index.html");
print $OUTHTML $tree->as_HTML;
close($OUTHTML);

$tree->delete;


