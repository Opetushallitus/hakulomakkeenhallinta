function RajaavatHakukohdeRyhmatPage() {
  var applicationSystemFormPage = openPage("/app/index.html#/applicationSystemForm", visible)

  var api = {
    openPage: applicationSystemFormPage,

    applicationRowKorkeakoulujenYhteishakuKevat2015: function() {
      return domUtil.applicationFormRowByName("Korkeakoulujen yhteishaku kevät 2015")
    },

    openKorkeakoulujenYhteishakuKevat2015LomakePohja: function() {
      return domUtil.openLomakepohjanAsetukset(api.applicationRowKorkeakoulujenYhteishakuKevat2015())
    },

    openRajaavatHakukohderyhmatPopup: function() {
      var row = domUtil.applicationRulesRajaavatHakukohderyhmat()
      domUtil.openDropdown(row)
    },

    openJyrinRajaavaRyhma: function() {
      var row = domUtil.applicationRulesRajaavatHakukohderyhmat()
      domUtil.openRajaavatHakukohderyhmat(row)
      var subGroup = row.children().find('ul .hh-list-h4:nth(0)')
      util.clickElement(subGroup.find('i').get(0))

      var deferred = Q.defer()
      wait.until(function () {
        return S('div[application-form=applicationForm]:visible:nth(1)').find('.hh-hakukohde').length > 0
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