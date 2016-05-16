/**
 * Module dependencies.
 */

var integration = require('segmentio-integration');
var mapper = require('./mapper');
var Batch = require('batch');

/**
 * Expose `QuanticMind`
 *
 */

var QuanticMind = module.exports = integration('QuanticMind')
  .endpoint('https://tr.staticiv.com/tracker/px/')
  .ensure('settings.clientId')
  .channels(['server'])
  .mapping('events')
  .mapper(mapper)
  .retries(2);

/**
 * QuanticMind requires an `.anonymousId` on all calls
 * unless using orderId for order attribution (noclick)
 */

QuanticMind.ensure(function(msg, settings){
  if (settings.noclick) return;
  if (msg.anonymousId()) return;
  return this.invalid('message.anonymousId is required unless using orderId attribution');
});

/**
 * Set up our prototype methods
 */

QuanticMind.prototype.track = send;
QuanticMind.prototype.page = send;

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
