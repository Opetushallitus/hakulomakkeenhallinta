(function () {
  describe('applicationSystemFormConfigurations-rajaavatHakukohdeRyhmat', function () {
    var page = RajaavatHakukohdeRyhmatPage()

    describe("hakulomakkeiden hallinta latautuu oikein", function() {
      before(page.openPage)

      it('Korkeakoulujen yhteishaku kevät 2015 näkyy lomakkeella', function () {
        expect(domUtil.applicationRowKorkeakoulujenYhteishakuKevat2015().length).to.equal(1, "Korkeakoulujen yhteishaku kevät 2015 ei näy lomakkeella")
      })

      describe("lomakepohjan hallinta latautuu oikein", function() {
        before(domUtil.openKorkeakoulujenYhteishakuKevat2015LomakePohja)

        it('otsikossa on oikea teksti', function() {
            expect(S('.ng-binding:nth(1)').text().trim()).to.equal("Lomakepohjan asetukset (Korkeakoulujen yhteishaku kevät 2015)", "Otsikossa ei ole oikeaa tekstiä")
        })

          describe("rajaavat hakukohderyhmät popup avautuu ja sulkeutuu", function() {
              before(page.openRajaavatHakukohderyhmatPopup)

              it('popupissa kaksi vaihtoehtoa', function() {
                  var menuItems = domUtil.dropDownRows(domUtil.applicationRulesRajaavatHakukohderyhmat())
                  expect(menuItems.length).to.equal(2, "Rajaavien hakukohderyhmien popupissa ei ole kahta vaihtoehtoa")
              })
          })

          describe("rajaavat hakukohderyhmät avautuu ja popup avautuu ja sulkeutuu", function() {
              before(page.openRajaavatHakukohderyhmatRyhmaPopup)

              it('popupissa neljä vaihtoehtoa', function() {
                  var menuItems = domUtil.dropDownRows(domUtil.applicationRulesRajaavatHakukohderyhmat().find('li.hh-hakukohde:visible').eq(0))
                  expect(menuItems.length).to.equal(4, "Rajaavien hakukohderyhmien popupissa ei ole neljää vaihtoehtoa")
              })

              describe("rajaava hakukohderyhmä avautuu oikein", function() {
                  before(page.openJyrinRajaavaRyhma)

                  it('ryhmässä viisi hakukohdetta', function() {
                      expect(S('div[application-form=applicationForm]:visible:nth(1)').find('.hh-hakukohde').length).to.equal(5, "Ryhmässä ei ole viittä hakukohdetta")
                  })

                  it('kullekin ryhmälle on poistonappi', function() {
                      expect(S('div[application-form=applicationForm]:visible:nth(1)').find('.hh-hakukohde a').length).to.equal(5, "Ryhmässä ei ole viittä hakukohteen poistonappia")
                  })
              })
          })
      })
    })
  })
})()