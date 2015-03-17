function PriorisoivatHakukohdeRyhmatPage() {
  var applicationSystemFormPage = openPage("/app/index.html#/applicationSystemForm", visible)

  var api = {
    openPage: applicationSystemFormPage,

    openPriorisoivatHakukohderyhmatPopup: function() {
      var row = domUtil.applicationRulesPriorisoivatHakukohderyhmat()
      domUtil.openDropdown(row)
    },

    openPriorisoivatHakukohderyhmatRyhmaPopup: function() {
      var row = domUtil.applicationRulesPriorisoivatHakukohderyhmat()
      domUtil.openHakukohderyhmat(row)
      var subGroup = row.find('li.hh-hakukohde:visible')

      var deferred = Q.defer()
      wait.until(function () {
        return $(subGroup.get(4)).find(".dropdown.pull-right i").length > 0
      })().then(function () {
        util.clickElement($(subGroup.get(4)).find(".dropdown.pull-right i").get(0))
        deferred.resolve()
      })
      return deferred.promise
    },

    openPriorisoivaRyhma1HhKehitys: function() {
      var row = domUtil.applicationRulesPriorisoivatHakukohderyhmat()
      var subGroup = row.children().find('ul .hh-list-h4').eq(4)
      util.clickElement(subGroup.find('i').get(0))
      var deferred = Q.defer()
      wait.until(function () {
        return S('div[ryhmat=priorisointiRyhmat]').find('.hh-hakukohde').length > 0
      })().then(function () {
        deferred.resolve()
      })
      return deferred.promise
    },

    loaded: function() {
      return S("td.ng-binding").toArray().length > 0
    }
  }
  return api

  function visible() {
    return api.loaded()
  }
}