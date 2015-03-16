(function () {
  describe('applicationSystemFormConfigurations-liiteOsoiteRyhmat', function () {
    var page = LiiteosoiteRyhmatPage()

    describe("liiteosoiteryhmä popup avautuu ja sulkeutuu", function() {
      before(page.openLiiteOsoiteRyhmat)

      it('popupissa kaksi vaihtoehtoa', function() {
        var menuItems = domUtil.dropDownRows(domUtil.applicationRulesLiiteOsoiteRyhmat())
        expect(menuItems.length).to.equal(2)
      })
    })

    describe("rajaavat hakukohderyhmät avautuu ja popup avautuu ja sulkeutuu", function() {
      before(page.openLiiteOsoiteRyhmaPopup)

      it('popupissa kolme vaihtoehtoa', function() {
        var menuItems = domUtil.dropDownRows(domUtil.applicationRulesLiiteOsoiteRyhmat().find('li.hh-hakukohde:visible').eq(0))
        expect(menuItems.length).to.equal(3)
      })
    })

    describe("rajaava hakukohderyhmä avautuu oikein", function() {
      before(page.openAMKLiiteryhma)

      it('ryhmässä on paljon hakukohteita', function() {
        var group = S('div[ryhmat=liiteRyhmat]').find('.hh-hakukohde').eq(0)
        expect(group.find("li.hh-hakukohde").length).to.equal(239)
      })
    })

    describe("rajaavan hakukohderyhmän popupissa on poistonappi", function() {
      before(page.openLiiteOsoiteRyhmanPopup)

      it('popupissa poista-vaihtoehto', function() {
        var menuItems = domUtil.dropDownRows(S('div[ryhmat=liiteRyhmat]').find('.hh-hakukohde').eq(0))
        expect(menuItems.length).to.equal(1)
      })
    })
  })
})()