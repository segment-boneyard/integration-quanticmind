/**
 * Module dependencies.
 */

var integration = require('segmentio-integration');
var mapper = require('./mapper');
var Batch = require('batch');

/**
 * Expose `Inside Vault`
 *
 */

var InsideVault = module.exports = integration('InsideVault')
  .endpoint('https://tr.staticiv.com/tracker/px/')
  .ensure('settings.clientId')
  .ensure('message.anonymousId')
  .channels(['server'])
  .mapping('events')
  .mapper(mapper)
  .retries(2);

/**
 * Set up our prototype methods
 */

InsideVault.prototype.track = send;
InsideVault.prototype.page = send;

/**
 * Track an event, or page call.
 *
 * https://www.dropbox.com/sh/7669xczwinj16a6/AAA82itoHhYESbGIYEMtFDGla?dl=0
 *
 * @param {Array} payloads
 * @param {Object} settings
 * @param {Function} fn
 */

function send(payloads, fn){
  var clientId = this.settings.clientId;
  var batch = new Batch;
  var self = this;

  payloads.forEach(function(payload){
    batch.push(function(done){
      self
      .get()
      .type('json')
      .query({ cl: clientId })
      .query(payload)
      .end(self.handle(done));
    });
  });

  batch.end(fn);
}
