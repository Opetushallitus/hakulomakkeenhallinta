(function () {
  describe('applicationSystemFormConfigrations-rajaavatHakukohdeRyhmat', function () {
    var page = RajaavatHakukohdeRyhmatPage()

    describe("hakulomakkeiden hallinta latautuu oikein", function() {
      before(page.openPage)

      it('Korkeakoulujen yhteishaku kevät 2015 näkyy lomakkeella', function () {
        expect(page.applicationRowKorkeakoulujenYhteishakuKevat2015().length).to.equal(1)
      })
    })

    describe("lomakepohjan hallinta latautuu oikein", function() {
      before(page.openKorkeakoulujenYhteishakuKevat2015LomakePohja)

      it('otsikossa on oikea teksti', function() {
        expect(S('.ng-binding:nth(1)').text().trim()).to.equal("Lomakepohjan asetukset (Korkeakoulujen yhteishaku kevät 2015)")
      })
    })
  })
})()