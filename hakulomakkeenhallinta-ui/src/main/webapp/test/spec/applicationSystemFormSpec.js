(function () {
  describe('applicationSystemForm-page', function () {
    var page = ApplicationSystemFormPage();

    before(
      page.openPage,
      domUtil.openKorkeakoulujenYhteishakuKevat2015LomakePohja
    )

    describe("rajaavan hakukohderyhmän lisääminen", function() {
      before(page.openAddRestrictionPopup)

      it('Testihaku testipisteeseen rajaavan hakukohderyhmän lisäys', function() {
        expect(S('h1.ng-binding:nth(1)').text().trim()).to.equal("Korkeakoulujen yhteishaku kevät 2015")
      })
    })
  })
})()