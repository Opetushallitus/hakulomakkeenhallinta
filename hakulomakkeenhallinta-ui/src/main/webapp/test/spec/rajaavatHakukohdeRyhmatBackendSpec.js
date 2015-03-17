(function () {
  describe('applicationSystemFormConfigurations-rajaavatHakukohdeRyhmat-backend', function () {
    var page = RajaavatHakukohdeRyhmatBackend()

    before(
      page.openPage,
      domUtil.openKorkeakoulujenYhteishakuKevat2015LomakePohja
    )

    describe("rajaavan hakukohderyhmän lisääminen", function() {
      before(page.openAddRestrictionPopup)

      it('Korkeakoulujen yhteishaku kevät 2015 rajaavan hakukohderyhmän lisäys', function() {
        expect(S('h1.ng-binding:nth(1)').text().trim()).to.equal("Korkeakoulujen yhteishaku kevät 2015")
      })
    })
  })
})()