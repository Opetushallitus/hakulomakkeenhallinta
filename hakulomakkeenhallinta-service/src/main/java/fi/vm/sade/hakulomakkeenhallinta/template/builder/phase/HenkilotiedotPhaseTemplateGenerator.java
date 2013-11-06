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
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.ContainedInOtherFieldValidator;
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.RegexFieldValidator;
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.RequiredFieldValidator;
import fi.vm.sade.hakulomakkeenhallinta.template.builder.util.TemplateUtil;
import org.springframework.stereotype.Service;

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

        /*
        RelatedQuestionRule hetuRule = new RelatedQuestionRule("hetuRule", kansalaisuus.getId(), "^$|^FIN$", true);
        hetuRule.addChild(socialSecurityNumber);
        henkilotiedotRyhma.addChild(hetuRule);

        // Ulkomaalaisten tunnisteet
        Radio onkoSinullaSuomalainenHetu = new Radio("onkoSinullaSuomalainenHetu",
                createI18NForm("form.henkilotiedot.hetu.onkoSuomalainen"));
        addDefaultTrueFalseOptions(onkoSinullaSuomalainenHetu);
        setRequiredInlineAndVerboseHelp(onkoSinullaSuomalainenHetu, "form.henkilotiedot.hetu.onkoSuomalainen.verboseHelp");
        RelatedQuestionRule suomalainenHetuRule = new RelatedQuestionRule("suomalainenHetuRule",
                onkoSinullaSuomalainenHetu.getId(), "^true$", false);
        suomalainenHetuRule.addChild(socialSecurityNumber);
        onkoSinullaSuomalainenHetu.addChild(suomalainenHetuRule);

        RelatedQuestionRule eiSuomalaistaHetuaRule = new RelatedQuestionRule("eiSuomalaistaHetuaRule",
                onkoSinullaSuomalainenHetu.getId(), "^false$", false);
        eiSuomalaistaHetuaRule.addChild(sukupuoli);

        DateQuestion syntymaaika = new DateQuestion("syntymaaika", createI18NForm("form.henkilotiedot.syntymaaika"));
        syntymaaika.setValidator(ElementUtil.createRegexValidator(syntymaaika.getId(), DATE_PATTERN));
        addRequiredValidator(syntymaaika);
        syntymaaika.setInline(true);
        eiSuomalaistaHetuaRule.addChild(syntymaaika);

        TextQuestion syntymapaikka =
                new TextQuestion("syntymapaikka", createI18NForm("form.henkilotiedot.syntymapaikka"));
        addSizeAttribute(syntymapaikka, 30);
        addRequiredValidator(syntymapaikka);
        syntymapaikka.setInline(true);
        eiSuomalaistaHetuaRule.addChild(syntymapaikka);

        TextQuestion kansallinenIdTunnus =
                new TextQuestion("kansallinenIdTunnus", createI18NForm("form.henkilotiedot.kansallinenId"));
        addSizeAttribute(kansallinenIdTunnus, 30);
        kansallinenIdTunnus.setInline(true);
        eiSuomalaistaHetuaRule.addChild(kansallinenIdTunnus);

        TextQuestion passinnumero = new TextQuestion("passinnumero", createI18NForm("form.henkilotiedot.passinnumero"));
        addSizeAttribute(passinnumero, 30);
        passinnumero.setInline(true);
        eiSuomalaistaHetuaRule.addChild(passinnumero);

        onkoSinullaSuomalainenHetu.addChild(eiSuomalaistaHetuaRule);

        RelatedQuestionRule ulkomaalaisenTunnisteetRule = new RelatedQuestionRule("ulkomaalaisenTunnisteetRule",
                kansalaisuus.getId(), NOT_FI, false);
        ulkomaalaisenTunnisteetRule.addChild(onkoSinullaSuomalainenHetu);
        henkilotiedotRyhma.addChild(ulkomaalaisenTunnisteetRule);

        // Email
        TextQuestion email = new TextQuestion("Sähköposti", createI18NForm("form.henkilotiedot.email"));
        addSizeAttribute(email, 50);
        email.setValidator(createRegexValidator(email.getId(), EMAIL_REGEX));
        email.setHelp(createI18NForm("form.henkilotiedot.email.help"));
        ElementUtil.setVerboseHelp(email, "form.henkilotiedot.email.verboseHelp");
        email.setInline(true);
        henkilotiedotRyhma.addChild(email);

        // Matkapuhelinnumerot

        TextQuestion puhelinnumero1 = new TextQuestion("matkapuhelinnumero1",
                createI18NForm("form.henkilotiedot.matkapuhelinnumero"));
        puhelinnumero1.setHelp(createI18NForm("form.henkilotiedot.matkapuhelinnumero.help"));
        addSizeAttribute(puhelinnumero1, 30);
        puhelinnumero1.setValidator(createRegexValidator(puhelinnumero1.getId(), MOBILE_PHONE_PATTERN));
        ElementUtil.setVerboseHelp(puhelinnumero1, "form.henkilotiedot.matkapuhelinnumero.verboseHelp");
        puhelinnumero1.setInline(true);
        henkilotiedotRyhma.addChild(puhelinnumero1);

        TextQuestion prevNum = puhelinnumero1;
        AddElementRule prevRule = null;
        for (int i = 2; i <= 5; i++) {
            TextQuestion extranumero = new TextQuestion("matkapuhelinnumero" + i,
                    createI18NForm("form.henkilotiedot.puhelinnumero"));
            extranumero.addAttribute("size", "30");
            addSizeAttribute(extranumero, 30);
            extranumero.setValidator(createRegexValidator(extranumero.getId(), PHONE_PATTERN));
            extranumero.setInline(true);

            AddElementRule extranumeroRule = new AddElementRule("addPuhelinnumero" + i + "Rule", prevNum.getId(),
                    createI18NForm("form.henkilotiedot.puhelinnumero.lisaa"));
            extranumeroRule.addChild(extranumero);
            if (i == 2) {
                henkilotiedotRyhma.addChild(extranumeroRule);
            } else {
                prevRule.addChild(extranumeroRule);
            }
            prevNum = extranumero;
            prevRule = extranumeroRule;
        }


        // Asuinmaa, osoite
        DropdownSelect asuinmaa = new DropdownSelect("asuinmaa", createI18NForm("form.henkilotiedot.asuinmaa"), null);
        asuinmaa.addOptions(koodistoService.getCountries());
        setDefaultOption("FIN", asuinmaa.getOptions());
        setRequiredInlineAndVerboseHelp(asuinmaa, "form.henkilotiedot.asuinmaa.verboseHelp");

        RelatedQuestionRule asuinmaaFI = new RelatedQuestionRule("rule1", asuinmaa.getId(), "FIN", true);
        Question lahiosoite = createRequiredTextQuestion("lahiosoite", "form.henkilotiedot.lahiosoite", 40);
        lahiosoite.setInline(true);
        asuinmaaFI.addChild(lahiosoite);

        Element postinumero = new PostalCode("Postinumero", createI18NForm("form.henkilotiedot.postinumero"),
                createPostOffices(koodistoService));
        addSizeAttribute(postinumero, 5);
        postinumero.addAttribute("maxlength", "5");
        addRequiredValidator(postinumero);
        postinumero.addAttribute("placeholder", "#####");
        postinumero.setValidator(createRegexValidator(postinumero.getId(), POSTINUMERO_PATTERN));
        postinumero.setHelp(createI18NForm("form.henkilotiedot.postinumero.help"));
        asuinmaaFI.addChild(postinumero);

        DropdownSelect kotikunta =
                new DropdownSelect("kotikunta", createI18NForm("form.henkilotiedot.kotikunta"), null);
        kotikunta.addOption(ElementUtil.createI18NAsIs(""), "");
        kotikunta.addOptions(koodistoService.getMunicipalities());
        setRequiredInlineAndVerboseHelp(kotikunta, "form.henkilotiedot.kotikunta.verboseHelp");
        kotikunta.setHelp(createI18NForm("form.henkilotiedot.kotikunta.help"));
        asuinmaaFI.addChild(kotikunta);

        RelatedQuestionRule relatedQuestionRule2 =
                new RelatedQuestionRule("rule2", asuinmaa.getId(), NOT_FI, false);
        Question osoiteUlkomaa = createRequiredTextQuestion("osoiteUlkomaa", "form.henkilotiedot.osoite", 40);
        osoiteUlkomaa.setInline(true);
        relatedQuestionRule2.addChild(osoiteUlkomaa);
        Question postinumeroUlkomaa = createRequiredTextQuestion("postinumeroUlkomaa", "form.henkilotiedot.postinumero", 12);
        postinumeroUlkomaa.setInline(true);
        relatedQuestionRule2.addChild(postinumeroUlkomaa);
        Question kaupunkiUlkomaa = createRequiredTextQuestion("kaupunkiUlkomaa", "form.henkilotiedot.kaupunki", 25);
        kaupunkiUlkomaa.setInline(true);
        relatedQuestionRule2.addChild(kaupunkiUlkomaa);

        asuinmaa.addChild(relatedQuestionRule2);
        asuinmaa.addChild(asuinmaaFI);

        henkilotiedotRyhma.addChild(asuinmaa);

        // Äidinkieli
        DropdownSelect aidinkieli =
                new DropdownSelect(AIDINKIELI_ID, createI18NForm("form.henkilotiedot.aidinkieli"),
                        "fi_vm_sade_oppija_language");
        aidinkieli.addOption(ElementUtil.createI18NAsIs(""), "");
        aidinkieli.addOptions(koodistoService.getLanguages());
        setRequiredInlineAndVerboseHelp(aidinkieli, "form.henkilotiedot.aidinkieli.verboseHelp");
        aidinkieli.setHelp(createI18NForm("form.henkilotiedot.aidinkieli.help"));
        henkilotiedotRyhma.addChild(aidinkieli); */


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
                "kansalaisuus", null);
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
            //addApplicationUniqueValidator(henkilotunnus, asType);
        }
        //ssn.setMaleOption();
        //ssn.setFemaleOption();
        return ssn;
    }

    private Radio createSukupuoliQuestion() {
        Radio sukupuoli = new Radio("sukupuoli", TemplateUtil.createI18NForm("form.henkilotiedot.sukupuoli"), "sukupuoli");
        sukupuoli.getValidators().add(new RequiredFieldValidator(sukupuoli.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        sukupuoli.setVerboseHelp(TemplateUtil.createI18NText("form.henkilotiedot.sukupuoli.verboseHelp", "form_verboseHelp"));
        /*
        sukupuoli.addOptions(koodistoService.getGenders());


        Option male = sukupuoli.getOptions().get(0).getI18nText().getTranslations().get("fi").equalsIgnoreCase("Mies") ?
                sukupuoli.getOptions().get(0) : sukupuoli.getOptions().get(1);
        Option female = sukupuoli.getOptions().get(0).getI18nText().getTranslations().get("fi").equalsIgnoreCase("Nainen") ?
                sukupuoli.getOptions().get(0) : sukupuoli.getOptions().get(1);
        */

        return sukupuoli;
    }
}
