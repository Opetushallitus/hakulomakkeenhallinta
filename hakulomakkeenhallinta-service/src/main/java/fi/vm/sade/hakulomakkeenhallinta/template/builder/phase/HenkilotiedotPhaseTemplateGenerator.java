/*
 * Copyright (c) 2013 The Finnish Board of Education - Opetushallitus
 *
 * This program is free software:  Licensed under the EUPL, Version 1.1 or - as
 * soon as they will be approved by the European Commission - subsequent versions
 * of the EUPL (the "Licence");
 *
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at: http://www.osor.eu/eupl/
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * European Union Public Licence for more details.
 */

package fi.vm.sade.hakulomakkeenhallinta.template.builder.phase;

import fi.vm.sade.hakulomakkeenhallinta.domain.*;
import fi.vm.sade.hakulomakkeenhallinta.domain.rule.AddElementRule;
import fi.vm.sade.hakulomakkeenhallinta.domain.rule.RelatedQuestionRule;
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.ContainedInOtherFieldValidator;
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.RegexFieldValidator;
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.RequiredFieldValidator;
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.SsnUniqueValidator;
import fi.vm.sade.hakulomakkeenhallinta.template.builder.util.TemplateUtil;
import org.springframework.stereotype.Service;

import java.util.HashMap;

/**
 * @author Mikko Majapuro
 */
@Service
public class HenkilotiedotPhaseTemplateGenerator {


    public static final String ISO88591_NAME_REGEX = "^$|^[a-zA-ZÀ-ÖØ-öø-ÿ]$|^[a-zA-ZÀ-ÖØ-öø-ÿ][a-zA-ZÀ-ÖØ-öø-ÿ ,-]*(?:[a-zA-ZÀ-ÖØ-öø-ÿ]+$)$";
    private static final String HETU_PATTERN = "^([0-9]{6}.[0-9]{3}([0-9]|[a-z]|[A-Z]))$";

    public Phase create(final String templateId) {
        Phase phase = new Phase("henkilotiedot", TemplateUtil.createI18NForm("form.henkilotiedot.otsikko"));
        Theme henkilotiedotRyhma = new Theme("henkilotiedotGrp", TemplateUtil.createI18NForm("form.henkilotiedot.otsikko"));

        TextQuestion sukunimi = createSukunimiQuestion();
        henkilotiedotRyhma.getChildren().add(sukunimi);

        TextQuestion etunimet = createEtunimetQuestion();
        henkilotiedotRyhma.getChildren().add(etunimet);

        TextQuestion kutsumanimi = createKutsumanimiQuestion(etunimet.getName());
        henkilotiedotRyhma.getChildren().add(kutsumanimi);

        DropdownSelect kansalaisuus = createKansalaisuusQuestion();
        henkilotiedotRyhma.getChildren().add(kansalaisuus);

        Radio sukupuoli = createSukupuoliQuestion();

        SocialSecurityNumber socialSecurityNumber = createSSNQuestion(templateId);

        RelatedQuestionRule hetuRule = new RelatedQuestionRule("hetuRule");
        hetuRule.getRelatedElementId().add(kansalaisuus.getId());
        hetuRule.setExpression("^$|^FIN$");
        hetuRule.setShowImmediately(true);

        hetuRule.getChildren().add(socialSecurityNumber);
        henkilotiedotRyhma.getChildren().add(hetuRule);

        // Ulkomaalaisten tunnisteet
        Radio onkoSinullaSuomalainenHetu = createOnkoSinullaSuomalainenHetuQuestion();

        RelatedQuestionRule suomalainenHetuRule = new RelatedQuestionRule("suomalainenHetuRule");
        suomalainenHetuRule.getRelatedElementId().add(onkoSinullaSuomalainenHetu.getId());
        suomalainenHetuRule.setExpression("^true$");
        suomalainenHetuRule.setShowImmediately(false);
        suomalainenHetuRule.getChildren().add(socialSecurityNumber);
        onkoSinullaSuomalainenHetu.getChildren().add(suomalainenHetuRule);

        RelatedQuestionRule eiSuomalaistaHetuaRule = new RelatedQuestionRule("eiSuomalaistaHetuaRule");
        eiSuomalaistaHetuaRule.getRelatedElementId().add(onkoSinullaSuomalainenHetu.getId());
        eiSuomalaistaHetuaRule.setExpression("^false$");
        eiSuomalaistaHetuaRule.setShowImmediately(false);
        eiSuomalaistaHetuaRule.getChildren().add(sukupuoli);

        DateQuestion syntymaaika = createSyntymaAikaQuestion();
        eiSuomalaistaHetuaRule.getChildren().add(syntymaaika);

        TextQuestion syntymapaikka = createSyntymapaikkaQuestion();
        eiSuomalaistaHetuaRule.getChildren().add(syntymapaikka);

        TextQuestion kansallinenIdTunnus = createKansallinenIdTunnus();
        eiSuomalaistaHetuaRule.getChildren().add(kansallinenIdTunnus);

        TextQuestion passinnumero = createPassinnumeroQuestion();
        eiSuomalaistaHetuaRule.getChildren().add(passinnumero);

        onkoSinullaSuomalainenHetu.getChildren().add(eiSuomalaistaHetuaRule);

        RelatedQuestionRule ulkomaalaisenTunnisteetRule = new RelatedQuestionRule("ulkomaalaisenTunnisteetRule");
        ulkomaalaisenTunnisteetRule.getRelatedElementId().add(kansalaisuus.getId());
        ulkomaalaisenTunnisteetRule.setExpression(TemplateUtil.NOT_FI);
        ulkomaalaisenTunnisteetRule.setShowImmediately(false);
        ulkomaalaisenTunnisteetRule.getChildren().add(onkoSinullaSuomalainenHetu);
        henkilotiedotRyhma.getChildren().add(ulkomaalaisenTunnisteetRule);

        TextQuestion email = createEmailQuestion();
        henkilotiedotRyhma.getChildren().add(email);

        TextQuestion puhelinnumero1 = createMatkapuhelinQuestion();
        henkilotiedotRyhma.getChildren().add(puhelinnumero1);

        createExtraPhoneNumbers(puhelinnumero1, henkilotiedotRyhma);

        DropdownSelect asuinmaa = createAsuinmaaQuestion();

        RelatedQuestionRule asuinmaaFI = new RelatedQuestionRule("rule1");
        asuinmaaFI.getRelatedElementId().add(asuinmaa.getId());
        asuinmaaFI.setExpression("FIN");
        asuinmaaFI.setShowImmediately(true);

        TextQuestion lahiosoite = createLahiosoiteQuestion();
        asuinmaaFI.getChildren().add(lahiosoite);

        Element postinumero = createPostinumeroQuestion();
        asuinmaaFI.getChildren().add(postinumero);

        DropdownSelect kotikunta = createKotikuntaQuestion();
        asuinmaaFI.getChildren().add(kotikunta);

        RelatedQuestionRule relatedQuestionRule2 = new RelatedQuestionRule("rule2");
        relatedQuestionRule2.getRelatedElementId().add(asuinmaa.getId());
        relatedQuestionRule2.setExpression(TemplateUtil.NOT_FI);
        relatedQuestionRule2.setShowImmediately(false);

        TextQuestion osoiteUlkomaa = createOsoiteUlkomaaQuestion();
        relatedQuestionRule2.getChildren().add(osoiteUlkomaa);

        TextQuestion postinumeroUlkomaa = createPostinumeroUlkomaatQuestion();
        relatedQuestionRule2.getChildren().add(postinumeroUlkomaa);

        TextQuestion kaupunkiUlkomaa = createKaupunkiUlkomaatQuestion();
        relatedQuestionRule2.getChildren().add(kaupunkiUlkomaa);

        asuinmaa.getChildren().add(relatedQuestionRule2);
        asuinmaa.getChildren().add(asuinmaaFI);

        henkilotiedotRyhma.getChildren().add(asuinmaa);

        DropdownSelect aidinkieli = createAidinkieliQuestion();
        henkilotiedotRyhma.getChildren().add(aidinkieli);

        phase.getChildren().add(henkilotiedotRyhma);
        return phase;
    }

    private TextQuestion createSukunimiQuestion() {
        TextQuestion sukunimi = new TextQuestion("Sukunimi", TemplateUtil.createI18NForm("form.henkilotiedot.sukunimi"),
                "Sukunimi", 30);
        sukunimi.getValidators().add(new RequiredFieldValidator(sukunimi.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        sukunimi.getValidators().add(new RegexFieldValidator(sukunimi.getName(),
                TemplateUtil.createI18NTextError("yleinen.virheellinenArvo"),
                ISO88591_NAME_REGEX));
        return sukunimi;
    }

    private TextQuestion createEtunimetQuestion() {
        TextQuestion etunimet = new TextQuestion("Etunimet", TemplateUtil.createI18NForm("form.henkilotiedot.etunimet"),
                "Etunimet", 30);
        etunimet.getValidators().add(new RequiredFieldValidator(etunimet.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        etunimet.getValidators().add(new RegexFieldValidator(etunimet.getName(),
                TemplateUtil.createI18NTextError("yleinen.virheellinenArvo"),
                ISO88591_NAME_REGEX));
        return etunimet;
    }

    private TextQuestion createKutsumanimiQuestion(final String etunimetName) {
        TextQuestion kutsumanimi = new TextQuestion("Kutsumanimi", TemplateUtil.createI18NForm("form.henkilotiedot.kutsumanimi"),
                "Kutsumanimi", 20);
        kutsumanimi.setHelp(TemplateUtil.createI18NForm("form.henkilotiedot.kutsumanimi.help"));
        kutsumanimi.getValidators().add(new ContainedInOtherFieldValidator(kutsumanimi.getName(),
                etunimetName, TemplateUtil.createI18NTextError("yleinen.virheellinenArvo")));
        kutsumanimi.getValidators().add(new RegexFieldValidator(kutsumanimi.getName(),
                TemplateUtil.createI18NTextError("yleinen.virheellinenArvo"),
                ISO88591_NAME_REGEX));
        kutsumanimi.getValidators().add(new RequiredFieldValidator(kutsumanimi.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        kutsumanimi.setVerboseHelp(TemplateUtil.createI18NText("form.henkilotiedot.kutsumanimi.verboseHelp", "form_verboseHelp"));
        return kutsumanimi;
    }

    private DropdownSelect createKansalaisuusQuestion() {
        // Kansalaisuus, hetu ja sukupuoli suomalaisille
        DropdownSelect kansalaisuus = new DropdownSelect("kansalaisuus", TemplateUtil.createI18NForm("form.henkilotiedot.kansalaisuus"),
                "kansalaisuus");
        //TODO! add options
        //kansalaisuus.addOptions(koodistoService.getNationalities());
        //setDefaultOption("FIN", kansalaisuus.getOptions());
        kansalaisuus.setHelp(TemplateUtil.createI18NForm("form.henkilotiedot.kansalaisuus.help"));
        kansalaisuus.setVerboseHelp(TemplateUtil.createI18NText("form.henkilotiedot.kansalaisuus.verboseHelp", "form_verboseHelp"));
        kansalaisuus.getValidators().add(new RequiredFieldValidator(kansalaisuus.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        return kansalaisuus;
    }

    private SocialSecurityNumber createSSNQuestion(final String templateId) {
        SocialSecurityNumber ssn = new SocialSecurityNumber("Henkilotunnus");
        ssn.setName("Henkilotunnus");
        ssn.setI18nText(TemplateUtil.createI18NForm("form.henkilotiedot.henkilotunnus"));
        ssn.setSize(11);
        ssn.setPlaceHolder("ppkkvv*****");
        ssn.setHelp(TemplateUtil.createI18NForm("form.henkilotiedot.henkilotunnus.help"));

        ssn.getValidators().add(new RegexFieldValidator(ssn.getName(),
                TemplateUtil.createI18NTextError("yleinen.virheellinenArvo"),
                HETU_PATTERN));
        ssn.getValidators().add(new RequiredFieldValidator(ssn.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        ssn.setVerboseHelp(TemplateUtil.createI18NText("form.henkilotiedot.henkilotunnus.verboseHelp", "form_verboseHelp"));

        ssn.setSexName("sukupuoli");
        ssn.setSexI18nText(TemplateUtil.createI18NForm("form.henkilotiedot.sukupuoli"));

        if (!templateId.equals(TemplateUtil.LISA_HAKU)) {
            ssn.getValidators().add(new SsnUniqueValidator());
        }
        //TODO! add options
        //ssn.setMaleOption();
        //ssn.setFemaleOption();
        return ssn;
    }

    private Radio createSukupuoliQuestion() {
        Radio sukupuoli = new Radio("sukupuoli", TemplateUtil.createI18NForm("form.henkilotiedot.sukupuoli"), "sukupuoli");
        sukupuoli.getValidators().add(new RequiredFieldValidator(sukupuoli.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        sukupuoli.setVerboseHelp(TemplateUtil.createI18NText("form.henkilotiedot.sukupuoli.verboseHelp", "form_verboseHelp"));
        //TODO! add options
        /*
        sukupuoli.addOptions(koodistoService.getGenders());


        Option male = sukupuoli.getOptions().get(0).getI18nText().getTranslations().get("fi").equalsIgnoreCase("Mies") ?
                sukupuoli.getOptions().get(0) : sukupuoli.getOptions().get(1);
        Option female = sukupuoli.getOptions().get(0).getI18nText().getTranslations().get("fi").equalsIgnoreCase("Nainen") ?
                sukupuoli.getOptions().get(0) : sukupuoli.getOptions().get(1);
        */

        return sukupuoli;
    }

    private Radio createOnkoSinullaSuomalainenHetuQuestion() {
        Radio onkoSinullaSuomalainenHetu = new Radio("onkoSinullaSuomalainenHetu",
                TemplateUtil.createI18NForm("form.henkilotiedot.hetu.onkoSuomalainen"), "onkoSinullaSuomalainenHetu");
        onkoSinullaSuomalainenHetu.getOptions().add(new Option(TemplateUtil.createI18NForm("form.yleinen.kylla"), TemplateUtil.KYLLA));
        onkoSinullaSuomalainenHetu.getOptions().add(new Option(TemplateUtil.createI18NForm("form.yleinen.ei"), TemplateUtil.EI));
        onkoSinullaSuomalainenHetu.getValidators().add(new RequiredFieldValidator(onkoSinullaSuomalainenHetu.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        onkoSinullaSuomalainenHetu.setVerboseHelp(TemplateUtil.createI18NText("form.henkilotiedot.hetu.onkoSuomalainen.verboseHelp", "form_verboseHelp"));
        return onkoSinullaSuomalainenHetu;
    }

    private DateQuestion createSyntymaAikaQuestion() {
        DateQuestion syntymaaika = new DateQuestion("syntymaaika", TemplateUtil.createI18NForm("form.henkilotiedot.syntymaaika"),
                "syntymaaika", "pp.kk.vvvv");
        syntymaaika.getValidators().add(new RequiredFieldValidator(syntymaaika.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        syntymaaika.getValidators().add(new RegexFieldValidator(syntymaaika.getName(),
                TemplateUtil.createI18NTextError("yleinen.virheellinenArvo"),
                TemplateUtil.DATE_PATTERN));
        return syntymaaika;
    }

    private TextQuestion createSyntymapaikkaQuestion() {
        TextQuestion syntymapaikka = new TextQuestion("syntymapaikka", TemplateUtil.createI18NForm("form.henkilotiedot.syntymapaikka"),
                "syntymapaikka", 30);
        syntymapaikka.getValidators().add(new RequiredFieldValidator(syntymapaikka.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        return syntymapaikka;
    }

    private TextQuestion createKansallinenIdTunnus() {
        TextQuestion kansallinenIdTunnus = new TextQuestion("kansallinenIdTunnus", TemplateUtil.createI18NForm("form.henkilotiedot.kansallinenId"),
                "kansallinenIdTunnus", 30);
        return kansallinenIdTunnus;
    }

    private TextQuestion createPassinnumeroQuestion() {
        TextQuestion passinnumero = new TextQuestion("passinnumero", TemplateUtil.createI18NForm("form.henkilotiedot.passinnumero"),
                "passinnumero", 30);
        return passinnumero;
    }

    private TextQuestion createEmailQuestion() {
        TextQuestion email = new TextQuestion("Sähköposti", TemplateUtil.createI18NForm("form.henkilotiedot.email"),
                "Sähköposti", 50);
        email.getValidators().add(new RegexFieldValidator(email.getName(),
                TemplateUtil.createI18NTextError("yleinen.virheellinenArvo"),
                TemplateUtil.EMAIL_REGEX));
        email.setHelp(TemplateUtil.createI18NForm("form.henkilotiedot.email.help"));
        email.setVerboseHelp(TemplateUtil.createI18NText("form.henkilotiedot.email.verboseHelp", "form_verboseHelp"));
        return email;
    }

    private TextQuestion createMatkapuhelinQuestion() {
        TextQuestion puhelinnumero1 = new TextQuestion("matkapuhelinnumero1", TemplateUtil.createI18NForm("form.henkilotiedot.matkapuhelinnumero"),
                "matkapuhelinnumero1", 30);
        puhelinnumero1.setHelp(TemplateUtil.createI18NForm("form.henkilotiedot.matkapuhelinnumero.help"));
        puhelinnumero1.getValidators().add(new RegexFieldValidator(puhelinnumero1.getName(),
                TemplateUtil.createI18NTextError("yleinen.virheellinenArvo"),
                TemplateUtil.MOBILE_PHONE_PATTERN));
        puhelinnumero1.setVerboseHelp(TemplateUtil.createI18NText("form.henkilotiedot.matkapuhelinnumero.verboseHelp", "form_verboseHelp"));
        return puhelinnumero1;
    }

    private void createExtraPhoneNumbers(final TextQuestion puhelinnumero1, final Theme henkilotiedotRyhma) {
        TextQuestion prevNum = puhelinnumero1;
        AddElementRule prevRule = null;
        for (int i = 2; i <= 5; i++) {
            TextQuestion extranumero = new TextQuestion("matkapuhelinnumero" + i, TemplateUtil.createI18NForm("form.henkilotiedot.puhelinnumero"),
                    "matkapuhelinnumero" + i, 30);
            extranumero.getValidators().add(new RegexFieldValidator(extranumero.getName(),
                    TemplateUtil.createI18NTextError("yleinen.virheellinenArvo"),
                    TemplateUtil.PHONE_PATTERN));

            AddElementRule extranumeroRule = new AddElementRule("addPuhelinnumero" + i + "Rule",
                    TemplateUtil.createI18NForm("form.henkilotiedot.puhelinnumero.lisaa"), prevNum.getId());
            extranumeroRule.getChildren().add(extranumero);

            if (i == 2) {
                henkilotiedotRyhma.getChildren().add(extranumeroRule);
            } else {
                prevRule.getChildren().add(extranumeroRule);
            }
            prevNum = extranumero;
            prevRule = extranumeroRule;
        }
    }

    private DropdownSelect createAsuinmaaQuestion() {
        // Asuinmaa, osoite
        DropdownSelect asuinmaa = new DropdownSelect("asuinmaa", TemplateUtil.createI18NForm("form.henkilotiedot.asuinmaa"), "asuinmaa");
        //TODO! set options
        //asuinmaa.addOptions(koodistoService.getCountries());
        //setDefaultOption("FIN", asuinmaa.getOptions());
        asuinmaa.setVerboseHelp(TemplateUtil.createI18NText("form.henkilotiedot.asuinmaa.verboseHelp", "form_verboseHelp"));
        asuinmaa.getValidators().add(new RequiredFieldValidator(asuinmaa.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        return asuinmaa;
    }

    private TextQuestion createLahiosoiteQuestion() {
        TextQuestion lahiosoite = new TextQuestion("lahiosoite", TemplateUtil.createI18NForm("form.henkilotiedot.lahiosoite"),
                "lahiosoite", 40);
        lahiosoite.getValidators().add(new RequiredFieldValidator(lahiosoite.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        return lahiosoite;
    }

    private PostalCode createPostinumeroQuestion() {
        //TODO! fetch post offices
        PostalCode postinumero = new PostalCode("Postinumero", "Postinumero", TemplateUtil.createI18NForm("form.henkilotiedot.postinumero"),
                new HashMap<String, PostOffice>(), 5);
        postinumero.getValidators().add(new RequiredFieldValidator(postinumero.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        postinumero.setPlaceHolder("#####");
        postinumero.getValidators().add(new RegexFieldValidator(postinumero.getName(),
                TemplateUtil.createI18NTextError("yleinen.virheellinenArvo"),
                TemplateUtil.POSTINUMERO_PATTERN));
        postinumero.setHelp(TemplateUtil.createI18NForm("form.henkilotiedot.postinumero.help"));
        return postinumero;
    }

    private DropdownSelect createKotikuntaQuestion() {
        DropdownSelect kotikunta = new DropdownSelect("kotikunta", TemplateUtil.createI18NForm("form.henkilotiedot.kotikunta"), "kotikunta");
        //TODO! add options
        //kotikunta.addOption(ElementUtil.createI18NAsIs(""), "");
        //kotikunta.addOptions(koodistoService.getMunicipalities());
        kotikunta.getValidators().add(new RequiredFieldValidator(kotikunta.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        kotikunta.setVerboseHelp(TemplateUtil.createI18NText("form.henkilotiedot.kotikunta.verboseHelp", "form_verboseHelp"));
        kotikunta.setHelp(TemplateUtil.createI18NForm("form.henkilotiedot.kotikunta.help"));
        return kotikunta;
    }

    private TextQuestion createOsoiteUlkomaaQuestion() {
        TextQuestion osoiteUlkomaa = new TextQuestion("osoiteUlkomaa", TemplateUtil.createI18NForm("form.henkilotiedot.osoite"),
                "osoiteUlkomaa", 40);
        osoiteUlkomaa.getValidators().add(new RequiredFieldValidator(osoiteUlkomaa.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        return osoiteUlkomaa;
    }

    private TextQuestion createPostinumeroUlkomaatQuestion() {
        TextQuestion postinumeroUlkomaa = new TextQuestion("postinumeroUlkomaa", TemplateUtil.createI18NForm("form.henkilotiedot.postinumero"),
                "postinumeroUlkomaa", 12);
        postinumeroUlkomaa.getValidators().add(new RequiredFieldValidator(postinumeroUlkomaa.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        return postinumeroUlkomaa;
    }

    private TextQuestion createKaupunkiUlkomaatQuestion() {
        TextQuestion kaupunkiUlkomaa = new TextQuestion("kaupunkiUlkomaa", TemplateUtil.createI18NForm("form.henkilotiedot.kaupunki"),
                "kaupunkiUlkomaa", 25);
        kaupunkiUlkomaa.getValidators().add(new RequiredFieldValidator(kaupunkiUlkomaa.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        return kaupunkiUlkomaa;
    }

    private DropdownSelect createAidinkieliQuestion() {
        // Äidinkieli
        DropdownSelect aidinkieli = new DropdownSelect(TemplateUtil.AIDINKIELI_ID, TemplateUtil.createI18NForm("form.henkilotiedot.aidinkieli"),
                TemplateUtil.AIDINKIELI_ID);
        //TODO! add options
        //aidinkieli.addOption(ElementUtil.createI18NAsIs(""), "");
        //aidinkieli.addOptions(koodistoService.getLanguages());
        aidinkieli.setDefaultValue("fi_vm_sade_oppija_language");
        aidinkieli.getValidators().add(new RequiredFieldValidator(aidinkieli.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        aidinkieli.setVerboseHelp(TemplateUtil.createI18NText("form.henkilotiedot.aidinkieli.verboseHelp", "form_verboseHelp"));
        aidinkieli.setHelp(TemplateUtil.createI18NForm("form.henkilotiedot.aidinkieli.help"));
        return aidinkieli;
    }
}
