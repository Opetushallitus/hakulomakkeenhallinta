var expect = chai.expect
chai.should()
chai.config.truncateThreshold = 0; // disable truncating

function S(selector) {
  try {
    if (!testFrame() || !testFrame().jQuery) {
      return $([])
    }
    return testFrame().jQuery(selector)
  } catch (e) {
    console.log("Premature access to testFrame.jQuery, printing stack trace.")
    console.log(new Error().stack);
    throw e;
  }
}

wait = {
  maxWaitMs: testTimeout,
  waitIntervalMs: 10,
  until: function(condition, count) {
    return function() {
      var deferred = Q.defer()
      if (count == undefined) count = wait.maxWaitMs / wait.waitIntervalMs;

      (function waitLoop(remaining) {
        if (condition()) {
          deferred.resolve()
        } else if (remaining === 0) {
          deferred.reject("timeout of " + wait.maxWaitMs + " in wait.until")
        } else {
          setTimeout(function() {
            waitLoop(remaining-1)
          }, wait.waitIntervalMs)
        }
      })(count)
      return deferred.promise
    }
  },
  untilFalse: function(condition) {
    return wait.until(function() { return !condition()})
  },
  forAngular: function() {
    var deferred = Q.defer()
    try {
      var angular = testFrame().angular
      var el = angular.element(S("#appRoot"))
      var timeout = angular.element(el).injector().get('$timeout')
      angular.element(el).injector().get('$browser').notifyWhenNoOutstandingRequests(function() {
        timeout(function() { deferred.resolve() })
      })
    } catch (e) {
      deferred.reject(e)
    }
    return deferred.promise
  },
  forMilliseconds: function(ms) {
    return function() {
      var deferred = Q.defer()
      setTimeout(function() {
        deferred.resolve()
      }, ms)
      return deferred.promise
    }
  }
}

mockAjax = {
  init: function() {
    var deferred = Q.defer()
    if (testFrame().sinon)
      deferred.resolve()
    else
      testFrame().$.getScript('test/lib/sinon-server-1.10.3.js', function() { deferred.resolve() } )
    return deferred.promise
  },
  respondOnce: function (method, url, responseCode, responseBody) {
    var fakeAjax = function() {
      var xhr = sinon.useFakeXMLHttpRequest()
      xhr.useFilters = true
      xhr.addFilter(function(method, url) {
        return url != _fakeAjaxParams.url || method != _fakeAjaxParams.method
      })

      xhr.onCreate = function (request) {
        window.setTimeout(function() {
          if (window._fakeAjaxParams && request.method == _fakeAjaxParams.method && request.url == _fakeAjaxParams.url) {
            request.respond(_fakeAjaxParams.responseCode, { "Content-Type": "application/json" }, _fakeAjaxParams.responseBody)
            xhr.restore()
            delete _fakeAjaxParams
          }
        }, 0)
      }
    }

    testFrame()._fakeAjaxParams = { method: method, url: url, responseCode: responseCode, responseBody: responseBody }
    testFrame().eval("(" + fakeAjax.toString() + ")()")
  }
}

domUtil = {
  applicationRowKorkeakoulujenYhteishakuKevat2015: function() {
    return domUtil.applicationFormRowByName("Korkeakoulujen yhteishaku kevät 2015")
  },

  openKorkeakoulujenYhteishakuKevat2015LomakePohja: function() {
    return domUtil.openLomakepohjanAsetukset(domUtil.applicationRowKorkeakoulujenYhteishakuKevat2015())
  },

  applicationFormRows: function() {
    return S("table tr")
  },
  openDropdown: function(row) {
    util.clickElement(row.find(".hh-icon-menu").get(0))
  },
  dropDownRows: function(row) {
    return row.find('ul.dropdown-menu li:visible')
  },
  selectLomakePohjanAsetukset: function(row) {
    util.clickElement(row.find("li:nth(1) a").get(0))
  },
  openLomakepohjanAsetukset: function(row) {
    domUtil.openDropdown(row)
    domUtil.selectLomakePohjanAsetukset(row)
    var deferred = Q.defer()
    wait.until(function () {
      return S('div[application-form=applicationForm]:visible').length == 3
    })().then(function () {
      deferred.resolve()
    })
    return deferred.promise
  },
  openHakukohderyhmat: function(row) {
    util.clickElement(row.find(".hh-list-h3 > i").get(0))
  },
  applicationFormRowByName: function(name) {
    return $(_.find(S("td.ng-binding"), function(e) { return $(e).text() == name })).parent()
  },
  applicationRulesRajaavatHakukohderyhmat: function() {
    return domUtil.applicationFormSettingsRowByName("Rajaavat hakukohderyhmät")
  },
  applicationRulesPriorisoivatHakukohderyhmat: function() {
    return domUtil.applicationFormSettingsRowByName("Priorisoivat hakukohderyhmät")
  },
  applicationFormSettingsRowByName: function(name) {
    return $(_.find(S("a.ng-binding"), function(e) { return $(e).text().trim() == name })).parent().parent()
  },
  selectAsetaRajaus: function(row) {
    util.clickElement(row.find("li:nth(0) a").get(0))
  }
}

util = {
  flattenObject: function(obj) {
    function flatten(obj, prefix, result) {
      _.each(obj, function(val, id) {
        if (_.isObject(val)) {
          flatten(val, id + ".", result)
        } else {
          result[prefix + id] = val
        }
      })
      return result
    }
    return flatten(obj, "", {})
  },
  clickElement: function(el) {
    var ev = document.createEvent("MouseEvent")
    ev.initMouseEvent(
      "click",
      true /* bubble */, true /* cancelable */,
      window, null,
      0, 0, 0, 0, /* coordinates */
      false, false, false, false, /* modifier keys */
      0 /*left*/, null
    )
    el.dispatchEvent(ev)
  }
}


function getJson(url) {
  return Q($.ajax({url: url, dataType: "json" }))
}

function testFrame() {
  return $("#testframe").get(0).contentWindow
}

function openPage(path, predicate) {
  if (!predicate) {
    predicate = function() { return testFrame().jQuery }
  }
  return function() {
    var newTestFrame = $('<iframe>').attr({src: path, width: 1024, height: 800, id: "testframe"})
    $("#testframe").replaceWith(newTestFrame)
    return wait.until(function() {
      return predicate()
    })().then(function() {
        window.uiError = null
        testFrame().onerror = function(err) { window.uiError = err; } // Hack: force mocha to fail on unhandled exceptions
    })
  }
}

function takeScreenshot() {
  if (window.callPhantom) {
    var date = new Date()
    var filename = "target/screenshots/" + date.getTime()
    console.log("Taking screenshot " + filename)
    callPhantom({'screenshot': filename})
  }
}

(function improveMocha() {
  var origBefore = before
  before = function() {
    Array.prototype.slice.call(arguments).forEach(function(arg) {
      if (typeof arg !== "function") {
        throw ("not a function: " + arg)
      }
      origBefore(arg)
    })
  }
})()