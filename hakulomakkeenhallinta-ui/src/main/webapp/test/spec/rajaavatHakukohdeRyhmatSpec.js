(function () {
  describe('applicationSystemFormConfigrations-rajaavatHakukohdeRyhmat', function () {
    var page = RajaavatHakukohdeRyhmatPage();

    before(
      page.openPage
    )

    describe("hakulomakkeiden hallinta latautuu oikein", function() {
      it('Korkeakoulujen yhteishaku kevät 2015 näkyy lomakkeella', function () {
        expect(domUtil.applicationFormRowByName("Korkeakoulujen yhteishaku kevät 2015").length).to.equal(1)
      })
    })


  })
})()