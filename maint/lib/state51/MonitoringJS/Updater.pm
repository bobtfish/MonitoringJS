package state51::MonitoringJS::Updater;
use strict;
use warnings;
use AnyEvent;
use AnyEvent::Handle;
use AnyEvent::Util qw/ portable_pipe fh_nonblocking /;
use Moo;

has filename => (
    is => 'ro',
    required => 1,
);

has on_read => (
    is => 'ro',
    required => 1,
);

sub run {
    my $self = shift;
    my $r;
    my $child_pid = open($r, "-|", "tail", "-f", $self->filename)
       // die "can't fork: $!";
    fh_nonblocking $r, 1;
    $self->{hdl} = AnyEvent::Handle->new(
        fh => $r,
        on_read => sub {
            my $hdl = shift;
            my $buf = $hdl->rbuf;
            $hdl->rbuf('');
            $self->on_read->($_) for split("\n", $buf);
        },
    );
    return $self;
}

1;

