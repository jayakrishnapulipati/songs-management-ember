Ember.LOG_BINDINGS = true;
App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_ACTIVE_GENERATIONS: true,
    LOG_VIEW_LOOKUPS: true
});

App.Artist = Ember.Object.extend({
    name: null,
    slug: function() {
        return this.get('name').dasherize();
    }.property('name'),
    songs: function() {
        return App.Songs.filterProperty('artist', this.get('name'));
    }.property('name', 'App.Songs.@each.artist')
});

App.Song = Ember.Object.extend({
    title: null,
    rating: null,
    artist: null
});

var artistNames = ['singer1', 'singer2'];
App.Artists = artistNames.map(function(name) {
    return App.Artist.create({
        name: name
    });
});
console.log(App.Artists);
App.Songs = Ember.A();

App.Songs.pushObject(App.Song.create({
    title: 'song1',
    rating: 4,
    artist: 'singer1'
}));
App.Songs.pushObject(App.Song.create({
    title: 'song2',
    rating: 4,
    artist: 'singer1'
}));
App.Songs.pushObject(App.Song.create({
    title: 'song3',
    rating: 4,
    artist: 'singer1'
}));

App.Songs.pushObject(App.Song.create({
    title: 'song1',
    rating: 5,
    artist: 'singer2'
}));
App.Songs.pushObject(App.Song.create({
    title: 'song2',
    rating: 5,
    artist: 'singer2'
}));

App.Router.map(function() {
    this.resource('artists', function() {
        this.route('songs', {path: ':slug'});
    });
});

App.IndexRoute = Ember.Route.extend({
    beforeModel: function() {
        this.transitionTo('artists');
    }
});

App.ArtistsRoute = Ember.Route.extend({
    model: function() {
        return App.Artists;
    },
    actions: {
        createArtist: function() {
            console.log('from createArtist function');
            var name = this.get('controller').get('newArtist');
            var artist = App.Artist.create({name: name});
            App.Artists.pushObject(artist);
            this.get('controller').set('newArtist', '');
        }
    }
});

App.ArtistsSongsRoute = Ember.Route.extend({
    model: function(params) {
        console.log(params);
        return App.Artists.findProperty('slug', params.slug);
    },
    actions: {
        createSong: function() {
            var title = this.get('controller.newSong');
            var artist = this.get('controller.model.name');
            console.log('from createSong function', title, artist);
            App.Songs.pushObject(App.Song.create({
                title: title,
                artist: artist,
                rating: 2
            }));
            this.get('controller').set('newSong', '');
            this.transitionTo('artists', artist);
        }
    }
});

App.starRating = Ember.View.extend({
    templateName: 'star-rating'
});

App.ArtistsController = Ember.ArrayController.extend({
    newArtist: '',
    disabled: function() {
        return Ember.isEmpty(this.get('newArtist'));
    }.property('newArtist')
});
App.ArtistsSongsController = Ember.ObjectController.extend({
    newSong: '',
    sortOptions: [
        {
            id: 'rating:desc,title:asc',
            name: 'Best'
        },
        {
            id: 'title:asc',
            name: 'By title (asc)'
        },
        {
            id: 'title:desc',
            name: 'By title (desc)'
        },
        {
            id: 'rating:asc',
            name: 'By rating (asc)'
        },
        {
            id: 'rating:desc',
            name: 'By rating (desc)'
        },
    ],
    selectedSort: 'rating:desc,title:asc',
    sortProperties: function() {
        var selected = this.get('selectedSort');
        return (selected ? selected.split(',') : ['rating:desc', 'title:asc']);
    }.property('selectedSort'),
    sortedSongs: Ember.computed.sort('songs', 'sortProperties'),

    disabled: function() {
        return Ember.isEmpty(this.get('newSong'));
    }.property('newSong'),
    songCreationStarted: false,
    canCreateSong: function() {
        return this.get('songCreationStarted') || this.get('songs.length');
    }.property('songCreationStarted', 'songs.length'),
    actions: {
        enableSongCreation: function() {
            this.set('songCreationStarted', true);
        }
    }
});
