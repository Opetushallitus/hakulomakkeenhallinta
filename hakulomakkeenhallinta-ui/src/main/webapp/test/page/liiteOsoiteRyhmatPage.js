function LiiteosoiteRyhmatPage() {
  var applicationSystemFormPage = openPage("/app/index.html#/applicationSystemForm", visible)

  var api = {
    openPage: applicationSystemFormPage,

    openLiiteOsoiteRyhmat: function() {
      var row = domUtil.applicationRulesLiiteOsoiteRyhmat()
      domUtil.openDropdown(row)
    },

    openLiiteOsoiteRyhmaPopup: function() {
      var row = domUtil.applicationRulesLiiteOsoiteRyhmat()
      domUtil.openHakukohderyhmat(row)
      var subGroup = row.find('li.hh-hakukohde:visible')

      var deferred = Q.defer()
      wait.until(function () {
        return $(subGroup.get(0)).find(".dropdown.pull-right i").length > 0
      })().then(function () {
        util.clickElement($(subGroup.get(0)).find(".dropdown.pull-right i").get(0))
        deferred.resolve()
      })
      return deferred.promise
    },

    openAMKLiiteryhma: function() {
      var row = domUtil.applicationRulesLiiteOsoiteRyhmat()
      var subGroup = row.children().find('ul .hh-list-h4').eq(0)
      util.clickElement(subGroup.find('i').get(0))
      var deferred = Q.defer()
      wait.until(function () {
        return S('div[ryhmat=liiteRyhmat]').find('.hh-hakukohde').length > 0
      })().then(function () {
        deferred.resolve()
      })
      return deferred.promise
    },

    openLiiteOsoiteRyhmanPopup: function() {
      var row = domUtil.applicationRulesLiiteOsoiteRyhmat()
      var subGroup = row.children().find('ul .hh-list-h4:nth(0)')
      var firstHakuKohde = subGroup.parent().find('.hh-hakukohde:nth(0)')
      domUtil.openDropdown(firstHakuKohde)
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