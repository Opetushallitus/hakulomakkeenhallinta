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

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;
import fi.vm.sade.hakulomakkeenhallinta.domain.*;
import fi.vm.sade.hakulomakkeenhallinta.domain.rule.RelatedQuestionRule;
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.PreferenceValidator;
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.RequiredFieldValidator;
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.SsnAndPreferenceUniqueValidator;
import fi.vm.sade.hakulomakkeenhallinta.template.builder.util.TemplateUtil;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Mikko Majapuro
 */
@Service
public class HakutoiveetPhaseTemplateGenerator {

    private static final String DISCRETIONARY_EDUCATION_DEGREE = "32";
    private static final String PERUSKOULU = "1";
    private static final String YLIOPPILAS = "9";
    private static final String OSITTAIN_YKSILOLLISTETTY = "2";
    private static final String ERITYISOPETUKSEN_YKSILOLLISTETTY = "3";
    private static final String YKSILOLLISTETTY = "6";
    private static final String KESKEYTYNYT = "7";
    private static final String ULKOMAINEN_TUTKINTO = "0";

    public Phase create(final String asType) {
        Phase phase = new Phase("hakutoiveet", TemplateUtil.createI18NForm("form.hakutoiveet.otsikko"));
        if (TemplateUtil.LISA_HAKU.equals(asType)) {
            phase.getChildren().add(createHakutoiveetThemeLisahaku());
        } else {
            phase.getChildren().add(createHakutoiveetTheme());
        }
        return phase;
    }

    private static Theme createHakutoiveetTheme() {
        Theme hakutoiveetTheme = new Theme("hakutoiveetGrp", TemplateUtil.createI18NForm("form.hakutoiveet.otsikko"));
        hakutoiveetTheme.setHelp(TemplateUtil.createI18NForm("form.hakutoiveet.help"));
        PreferenceTable preferenceTable = new PreferenceTable("preferencelist", TemplateUtil.createI18NForm("form.hakutoiveet.otsikko"));

        PreferenceRow pr1 = createI18NPreferenceRow("preference1", "1");
        pr1.getValidators().add(new RequiredFieldValidator(pr1.getLearningInstitutionInputId(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        pr1.getValidators().add(new RequiredFieldValidator(pr1.getEducationInputId(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));

        PreferenceRow pr2 = createI18NPreferenceRow("preference2", "2");
        PreferenceRow pr3 = createI18NPreferenceRow("preference3", "3");
        PreferenceRow pr4 = createI18NPreferenceRow("preference4", "4");
        PreferenceRow pr5 = createI18NPreferenceRow("preference5", "5");
        preferenceTable.getChildren().add(pr1);
        preferenceTable.getChildren().add(pr2);
        preferenceTable.getChildren().add(pr3);
        preferenceTable.getChildren().add(pr4);
        preferenceTable.getChildren().add(pr5);
        preferenceTable.setVerboseHelp(TemplateUtil.createI18NText("form.hakutoiveet.otsikko.verboseHelp", "form_verboseHelp"));
        hakutoiveetTheme.getChildren().add(preferenceTable);
        return hakutoiveetTheme;
    }

    private static Theme createHakutoiveetThemeLisahaku() {
        Theme hakutoiveetTheme = new Theme("hakutoiveetGrp", TemplateUtil.createI18NForm("form.hakutoiveet.otsikko"));
        hakutoiveetTheme.setHelp(TemplateUtil.createI18NForm("form.hakutoiveet.lisahaku.help"));
        final String id = "preference1";
        SinglePreference singlePreference = new SinglePreference(id,
                TemplateUtil.createI18NForm("form.hakutoiveet.koulutus"),
                TemplateUtil.createI18NForm("form.hakutoiveet.opetuspiste"),
                TemplateUtil.createI18NForm("form.hakutoiveet.otsikko"),
                TemplateUtil.createI18NForm("form.hakutoiveet.sisaltyvatKoulutusohjelmat"));

        singlePreference.getValidators().add(new RequiredFieldValidator(singlePreference.getId() + "-Opetuspiste",
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        singlePreference.getValidators().add(new RequiredFieldValidator(singlePreference.getId() + "-Koulutus",
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));

        singlePreference.getChildren().addAll(createDiscretionaryQuestionsAndRules(id));
        singlePreference.getChildren().add(createSoraQuestions(id));
        singlePreference.getChildren().add(createUrheilijanAmmatillisenKoulutuksenLisakysymysAndRule(id));
        hakutoiveetTheme.getChildren().add(singlePreference);

        singlePreference.setVerboseHelp(TemplateUtil.createI18NText("form.hakutoiveet.otsikko.lisahaku.verboseHelp", "form_verboseHelp"));
        singlePreference.getValidators().add(new PreferenceValidator());
        singlePreference.getValidators().add(new SsnAndPreferenceUniqueValidator());
        return hakutoiveetTheme;
    }

    public static PreferenceRow createI18NPreferenceRow(final String id, final String title) {
        PreferenceRow pr = new PreferenceRow(id,
                TemplateUtil.createI18NForm("form.hakutoiveet.hakutoive", title),
                TemplateUtil.createI18NForm("form.yleinen.tyhjenna"),
                TemplateUtil.createI18NForm("form.hakutoiveet.koulutus"),
                TemplateUtil.createI18NForm("form.hakutoiveet.opetuspiste"),
                TemplateUtil.createI18NForm("form.hakutoiveet.sisaltyvatKoulutusohjelmat"));

        pr.getChildren().addAll(createDiscretionaryQuestionsAndRules(id));

        pr.getChildren().add(createSoraQuestions(id));
        pr.getChildren().add(createUrheilijanAmmatillisenKoulutuksenLisakysymysAndRule(id));

        pr.getValidators().add(new PreferenceValidator());

        return pr;
    }

    private static List<RelatedQuestionRule> createDiscretionaryQuestionsAndRules(final String index) {
        Radio discretionary = new Radio(index + "-discretionary", TemplateUtil.createI18NForm("form.hakutoiveet.harkinnanvarainen"),
                index + "-discretionary");
        discretionary.getOptions().add(new Option(TemplateUtil.createI18NForm("form.yleinen.kylla"),
                TemplateUtil.KYLLA));
        discretionary.getOptions().add(new Option(TemplateUtil.createI18NForm("form.yleinen.ei"),
                TemplateUtil.EI));
        discretionary.getValidators().add(new RequiredFieldValidator(discretionary.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));

        discretionary.setHelp(TemplateUtil.createI18NForm("form.hakutoiveet.harkinnanvarainen.ohje"));

        DropdownSelect discretionaryFollowUp = new DropdownSelect(discretionary.getId() + "-follow-up",
                TemplateUtil.createI18NForm("form.hakutoiveet.harkinnanvarainen.perustelu"), discretionary.getId() + "-follow-up");
        discretionaryFollowUp.getOptions().add(TemplateUtil.createEmptyOption());
        discretionaryFollowUp.getOptions().add(new Option(TemplateUtil.createI18NForm("form.hakutoiveet.harkinnanvarainen.perustelu.oppimisvaikeudet"),
                "oppimisvaikudet"));
        discretionaryFollowUp.getOptions().add(new Option(TemplateUtil.createI18NForm("form.hakutoiveet.harkinnanvarainen.perustelu.sosiaaliset"),
                "sosiaalisetsyyt"));
        discretionaryFollowUp.getValidators().add(new RequiredFieldValidator(discretionaryFollowUp.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));

        RelatedQuestionRule discretionaryFollowUpRule = new RelatedQuestionRule(index + "-discretionary-follow-up-rule");
        discretionaryFollowUpRule.setRelatedElementId(ImmutableList.of(discretionary.getId()));
        discretionaryFollowUpRule.setExpression(Boolean.TRUE.toString().toLowerCase());
        discretionaryFollowUpRule.setShowImmediately(false);
        discretionaryFollowUpRule.getChildren().add(discretionaryFollowUp);

        discretionary.getChildren().add(discretionaryFollowUpRule);

        RelatedQuestionRule discretionaryRule = new RelatedQuestionRule(index + "-discretionary-rule");
        discretionaryRule.setRelatedElementId(ImmutableList.of(index + "-Koulutus-educationDegree"));
        discretionaryRule.setExpression(DISCRETIONARY_EDUCATION_DEGREE);
        discretionaryRule.setShowImmediately(false);

        RelatedQuestionRule discretionaryRule2 = new RelatedQuestionRule(index + "-discretionary-rule2");
        discretionaryRule2.setRelatedElementId(ImmutableList.of("POHJAKOULUTUS"));
        discretionaryRule2.setExpression("(" + PERUSKOULU + "|" + YLIOPPILAS + "|" + OSITTAIN_YKSILOLLISTETTY + "|" +
                ERITYISOPETUKSEN_YKSILOLLISTETTY + "|" + YKSILOLLISTETTY + ")");
        discretionaryRule2.setShowImmediately(false);

        discretionaryRule.getChildren().add(discretionary);
        discretionaryRule2.getChildren().add(discretionaryRule);

        RelatedQuestionRule discretionaryRule3 = new RelatedQuestionRule(index + "-discretionary-rule3");
        discretionaryRule3.setRelatedElementId(ImmutableList.of("POHJAKOULUTUS"));
        discretionaryRule3.setExpression("(" + KESKEYTYNYT + "|" + ULKOMAINEN_TUTKINTO + ")");
        discretionaryRule3.setShowImmediately(false);
        discretionaryRule3.getChildren().add(new HiddenValue(discretionary.getId(), discretionary.getName(), TemplateUtil.KYLLA));

        return Lists.newArrayList(discretionaryRule2, discretionaryRule3);

    }

    public static Element createSoraQuestions(final String index) {
        // sora-kysymykset
        RelatedQuestionRule hasSora = new RelatedQuestionRule(index + "_sora_rule");
        hasSora.setRelatedElementId(ImmutableList.of(index + "-Koulutus-id-sora"));
        hasSora.setExpression(TemplateUtil.KYLLA);
        hasSora.setShowImmediately(false);

        Radio sora1 = new Radio(index + "_sora_terveys", TemplateUtil.createI18NForm("form.sora.terveys"), index + "_sora_terveys");
        sora1.getOptions().add(new Option(TemplateUtil.createI18NForm("form.yleinen.ei"), TemplateUtil.EI));
        sora1.getOptions().add(new Option(TemplateUtil.createI18NForm("form.sora.kylla"), TemplateUtil.KYLLA));
        sora1.getValidators().add(new RequiredFieldValidator(sora1.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));


        sora1.setPopup(new Popup("sora-popup", TemplateUtil.createI18NForm("form.hakutoiveet.terveydentilavaatimukset.otsikko")));

        Radio sora2 = new Radio(index + "_sora_oikeudenMenetys", TemplateUtil.createI18NForm("form.sora.oikeudenMenetys"),
                index + "_sora_oikeudenMenetys");
        sora2.getOptions().add(new Option(TemplateUtil.createI18NForm("form.yleinen.ei"), TemplateUtil.EI));
        sora2.getOptions().add(new Option(TemplateUtil.createI18NForm("form.sora.kylla"), TemplateUtil.KYLLA));
        sora2.getValidators().add(new RequiredFieldValidator(sora2.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));

        hasSora.getChildren().add(sora1);
        hasSora.getChildren().add(sora2);
        return hasSora;
    }

    public static Element createUrheilijanAmmatillisenKoulutuksenLisakysymysAndRule(final String index) {

        Radio radio = new Radio(index + "_urheilijan_ammatillisen_koulutuksen_lisakysymys",
                TemplateUtil.createI18NForm("form.hakutoiveet.urheilijan.ammatillisen.koulutuksen.lisakysymys"),
                index + "_urheilijan_ammatillisen_koulutuksen_lisakysymys");
        radio.getOptions().add(new Option(TemplateUtil.createI18NForm("form.yleinen.ei"), TemplateUtil.EI));
        radio.getOptions().add(new Option(TemplateUtil.createI18NForm("form.sora.kylla"), TemplateUtil.KYLLA));
        radio.getValidators().add(new RequiredFieldValidator(radio.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        RelatedQuestionRule hasQuestion = new RelatedQuestionRule(radio.getId() + "_related_question_rule");
        hasQuestion.setRelatedElementId(ImmutableList.of(index + "-Koulutus-id-athlete"));
        hasQuestion.setExpression(TemplateUtil.KYLLA);
        hasQuestion.setShowImmediately(false);

        hasQuestion.getChildren().add(radio);
        return hasQuestion;
    }
}
