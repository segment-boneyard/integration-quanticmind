
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
  var noclick = this.settings.noclick;
  var revenue = track.revenue() || track.value() || 0;
  var actid = track.orderId() || '';
  return events.map(function(event){
    var payload = common(track, noclick);
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
  var noclick = this.settings.noclick;
  var payload = common(page, noclick);
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
 * Format the QuanticMind specific properties.
 *
 * @param {Track} facade
 * @return {Object}
 */

function common(facade, noclick){
  var id = noclick ? 'noclick' : facade.anonymousId();
  return {
    u: id,
    t: facade.timestamp().getTime(),
    z: 0,
    r: exports.random()
  };
}
