#!/usr/bin/env perl
use strict;
use warnings;
use File::Spec;
use FindBin qw/ $Bin /;
use HTML::TreeBuilder;
use JavaScript::Minifier qw/minify/;

my $tree = HTML::TreeBuilder->new;
$tree->parse_file(File::Spec->catdir($Bin, 'app.html'));
my @js_nodes = $tree->look_down(
    "_tag" => "script",
    sub { $_[0]->attr('src') && $_[0]->attr('src') =~ /js$/ }
);
my @js = map { $_->attr('src') } @js_nodes;
my @css_nodes = $tree->look_down(
    "_tag" => "link",
    sub { $_[0]->attr('href') && $_[0]->attr('href') =~ /css$/ }
);
my @css = map { $_->attr('href') } @css_nodes;

my %types = (
    js => {
        list => \@js,
    },
    css => {
        list => \@css,
    },
);

foreach my $type (keys %types) {
    my $data = $types{$type};
    foreach my $file (@{ $data->{list} }) {
        open(my $INFILE, '<', File::Spec->catdir($Bin, '..', $file))
            or die "Could not open $file: $!";;
        my $in = do { local $/; <$INFILE> };
        close($INFILE);
        $data->{out} .= $in;
    }
}

open(my $OUTJS, '>', File::Spec->catdir($Bin, "all.js"))
    or die("Could not write all.js");
print $OUTJS $types{js}{out};
close($OUTJS);

system("java -jar yuicompressor-2.3.6.jar all.js -o all.min.js")
    and die("yui compressor failed!");

open(my $INJS, '<',  File::Spec->catdir($Bin, "all.min.js"))
    or die("Could not write all.js");
my $min = do { local $/; <$INJS> };

my $css_el = HTML::Element->new('style', type => 'text/css');
$css_el->push_content(join(' ', split(/\n/, $types{css}{out})));
$css_nodes[0]->preinsert($css_el);
$_->detach for @css_nodes;

my $js_el = HTML::Element->new('script');
$js_el->push_content($min);
$js_nodes[0]->preinsert($js_el);
$_->detach for @js_nodes;

open(my $OUTHTML, '>', File::Spec->catdir($Bin, '..', "index.html"))
    or die("Could not write index.html");
print $OUTHTML join(" ", map { s/^\s+//; $_ } split(/\n/, $tree->as_HTML));
close($OUTHTML);

$tree->delete;


