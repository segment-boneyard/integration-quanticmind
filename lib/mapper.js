
/**
 * Module dependencies.
 */

var find = require('obj-case');

var has = Object.prototype.hasOwnProperty;

/**
 * Map track
 *
 * @param {Track} track
 * @param {Object} settings
 * @return {Array}
 * @api private
 */

exports.track = function(track){
  var events = this.events(track.event());
  var revenue = track.revenue() || track.value() || 0;
  var actid = track.orderId() || '';
  return events.map(function(event){
    var payload = common(track);
    payload.act = event;
    payload.actv = revenue;
    payload.actcid = actid || '';
    payload.a = 3;
    return payload;
  });
};

/**
 * Map page.
 *
 * @param {Page} page
 * @param {Object} settings
 * @return {Array}
 * @api private
 */

exports.page = function(page){
  var payload = common(page);
  payload.url = page.url() || '';
  payload.ref = page.referrer() || '';
  payload.a = 1;
  return [payload];
};

/**
 * Export random number function for testing.
 */

exports.random = function(){
  return Math.round(Math.random() * 99999999);
};

/**
 * Format the Inside Vault specific properties.
 *
 * @param {Track} facade
 * @return {Object}
 */

function common(facade){
  return {
    u: facade.anonymousId(),
    t: facade.timestamp().getTime(),
    z: 0,
    r: exports.random()
  };
}
