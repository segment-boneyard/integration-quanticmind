
var Test = require('segmentio-integration-tester');
var InsideVault = require('../');
var mapper = require('../lib/mapper');
var assert = require('assert');

describe('Inside Vault', function(){
  var insideVault;
  var settings;
  var test;

  beforeEach(function(){
    settings = {
      clientId: 'test17',
      events: {
        'user_state_change:Applied':'event2',
        'user_state_change:Enrolled':'event3'
      }
    };
    insideVault = new InsideVault(settings);
    test = Test(insideVault, __dirname);
    test.mapper(mapper);
    mapper.random = function(){ return 0; };
  });

  it('should have the correct settings', function(){
    test
      .name('InsideVault')
      .channels(['server'])
      .ensure('settings.clientId')
      .ensure('message.anonymousId')
  });

  describe('.validate()', function() {
    it('should not be valid without a clientId', function(){
      test.invalid({}, {});
    });

    it('should be valid with complete settings', function(){
      test.valid({anonymousId:'abc'}, settings);
    });
    it('should require valid anonymousId', function(){
      test.invalid({}, settings);
    });
  });

  describe('mapper', function(){
    describe('track', function(){
      it('should map basic track', function(){
        test.maps('track-basic');
      });

      it('should map multi track', function(){
        test.maps('track-multi');
      });

      it('should map bare track', function(){
        test.maps('track-bare');
      });

      it('should map noclick', function(){
        test.maps('track-noclick');
      });
    });



    describe('page', function(){
      it('should map basic page', function(){
        test.maps('page-basic');
      });
    });
  });


  describe('.track()', function(){
    it('should send basic track', function(done){
      var json = test.fixture('track-basic');
      test
        .set(settings)
        .track(json.input)
        .query(json.output[0])
        .query({ cl: settings.clientId })
        .expects(204, done);
    });

    it('should send bare track', function(done){
      var json = test.fixture('track-bare');
      test
        .set(settings)
        .track(json.input)
        .query(json.output[0])
        .query({ cl: settings.clientId })
        .expects(204, done);
    });

    it('should send multiple events', function(done){
      var json = test.fixture('track-multi');
      insideVault.settings.events = json.settings.events;
      test.track(json.input);
      test.requests(2);

      json.output.forEach(function(query, i){
        test
        .request(i)
        .query(query)
        .query({ cl: settings.clientId })
        .expects(204);
      });

      test.end(done);
    });

    it('should not make a request if conversion event does not exist', function(done){
      test
        .set(settings)
        .track({ event: 'invalid event' })
        .end(function(err, res){
          assert(!err);
          assert.deepEqual(res, []);
          done(err);
        });
    });
  });

  describe('.page()', function(){
    it('should send basic page', function(done){
      var json = test.fixture('page-basic');
      test
        .set(settings)
        .page(json.input)
        .query(json.output[0])
        .query({ cl: settings.clientId })
        .expects(204, done);
    });
  });

});
