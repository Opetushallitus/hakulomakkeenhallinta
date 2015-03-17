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
        expect("").to.equal("")
      })
    })
  })
})()