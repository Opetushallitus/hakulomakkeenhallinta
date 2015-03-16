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
  })
})()