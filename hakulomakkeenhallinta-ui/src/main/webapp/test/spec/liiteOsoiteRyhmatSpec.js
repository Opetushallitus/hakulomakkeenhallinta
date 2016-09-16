(function () {
  describe('applicationSystemFormConfigurations-liiteOsoiteRyhmat', function () {
    var page = LiiteosoiteRyhmatPage()
    before(
      page.openPage,
      domUtil.openKorkeakoulujenYhteishakuKevat2015LomakePohja
    )

    describe("liiteosoiteryhmä popup avautuu ja sulkeutuu", function() {
      before(page.openLiiteOsoiteRyhmat)

      it('popupissa kaksi vaihtoehtoa', function() {
        var menuItems = domUtil.dropDownRows(domUtil.applicationRulesLiiteOsoiteRyhmat())
        expect(menuItems.length).to.equal(2, "Liiteosoiteryhmän popupissa ei ole kahta vaihtoehtoa")
      })

      describe("liiteosoitehakukohderyhmät avautuu ja popup avautuu ja sulkeutuu", function() {
        before(page.openLiiteOsoiteRyhmaPopup)

        it('popupissa kolme vaihtoehtoa', function() {
            var menuItems = domUtil.dropDownRows(domUtil.applicationRulesLiiteOsoiteRyhmat().find('li.hh-hakukohde:visible').eq(0))
            expect(menuItems.length).to.equal(3, "Liiteosoiteryhmän popupissa ei ole kolmea vaihtoehtoa")
        })

        describe("liiteosoitehakukohderyhmä avautuu oikein", function() {
          before(page.openAMKLiiteryhma)

          it('ryhmässä on paljon hakukohteita', function() {
            var group = S('div[ryhmat=liiteRyhmat]').find('.hh-hakukohde').eq(0)
            expect(group.find("li.hh-hakukohde").length).to.equal(239, "Liiteosoitehakukohderyhmässä väärä määrä hakukohteita")
          })
          it('kullekin hakukohteelle on poistonappi', function() {
            var group = S('div[ryhmat=liiteRyhmat]').find('.hh-hakukohde').eq(0)
            expect(group.find("li.hh-hakukohde a").length).to.equal(239, "Liiteosoitehakukohderyhmässä väärä määrä hakukohteiden poistonappeja")
          })
        })
      })
    })
  })
})()