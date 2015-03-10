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

    loaded: function() {
      return S("td.ng-binding").toArray().length > 0
    }
  }
  return api

  function visible() {
    return api.loaded()
  }
}