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

package fi.vm.sade.hakulomakkeenhallinta.domain;

import org.mongodb.morphia.annotations.Embedded;

/**
 * @author Mikko Majapuro
 */
@Embedded
public class PreferenceRow extends Element {

    @Embedded
    private I18nText i18nText;
    @Embedded
    private I18nText resetLabel;
    @Embedded
    private I18nText educationLabel;
    @Embedded
    private I18nText learningInstitutionLabel;
    @Embedded
    private I18nText childLONameListLabel;
    private String learningInstitutionInputId;
    private String educationInputId;
    private String educationDegreeId;

    public PreferenceRow() {}

    public PreferenceRow(final String id, final I18nText i18nText, final I18nText resetLabel, final I18nText educationLabel,
                         final I18nText learningInstitutionLabel, final I18nText childLONameListLabel
    ) {
        super(id);
        this.i18nText = i18nText;
        this.resetLabel = resetLabel;
        this.educationLabel = educationLabel;
        this.learningInstitutionLabel = learningInstitutionLabel;
        this.childLONameListLabel = childLONameListLabel;
        this.learningInstitutionInputId = this.getId() + "-Opetuspiste";
        this.educationInputId = this.getId() + "-Koulutus";
        this.educationDegreeId = this.getId() + "-Koulutus-educationDegree";
    }

    public I18nText getI18nText() {
        return i18nText;
    }

    public void setI18nText(I18nText i18nText) {
        this.i18nText = i18nText;
    }

    public I18nText getResetLabel() {
        return resetLabel;
    }

    public void setResetLabel(I18nText resetLabel) {
        this.resetLabel = resetLabel;
    }

    public I18nText getEducationLabel() {
        return educationLabel;
    }

    public void setEducationLabel(I18nText educationLabel) {
        this.educationLabel = educationLabel;
    }

    public I18nText getLearningInstitutionLabel() {
        return learningInstitutionLabel;
    }

    public void setLearningInstitutionLabel(I18nText learningInstitutionLabel) {
        this.learningInstitutionLabel = learningInstitutionLabel;
    }

    public I18nText getChildLONameListLabel() {
        return childLONameListLabel;
    }

    public void setChildLONameListLabel(I18nText childLONameListLabel) {
        this.childLONameListLabel = childLONameListLabel;
    }

    public String getLearningInstitutionInputId() {
        return learningInstitutionInputId;
    }

    public void setLearningInstitutionInputId(String learningInstitutionInputId) {
        this.learningInstitutionInputId = learningInstitutionInputId;
    }

    public String getEducationInputId() {
        return educationInputId;
    }

    public void setEducationInputId(String educationInputId) {
        this.educationInputId = educationInputId;
    }

    public String getEducationDegreeId() {
        return educationDegreeId;
    }

    public void setEducationDegreeId(String educationDegreeId) {
        this.educationDegreeId = educationDegreeId;
    }
}
