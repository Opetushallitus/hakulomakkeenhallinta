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
public class SocialSecurityNumber extends Element {

    @Embedded
    private I18nText i18nText;
    private String name;
    private Integer size;
    private String placeHolder;
    private String sexName;
    @Embedded
    private I18nText sexI18nText;
    @Embedded
    private Option maleOption;
    @Embedded
    private Option femaleOption;

    public SocialSecurityNumber() {}

    public SocialSecurityNumber(final String id) {
        super(id);
    }

    public I18nText getI18nText() {
        return i18nText;
    }

    public void setI18nText(I18nText i18nText) {
        this.i18nText = i18nText;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getPlaceHolder() {
        return placeHolder;
    }

    public void setPlaceHolder(String placeHolder) {
        this.placeHolder = placeHolder;
    }

    public String getSexName() {
        return sexName;
    }

    public void setSexName(String sexName) {
        this.sexName = sexName;
    }

    public I18nText getSexI18nText() {
        return sexI18nText;
    }

    public void setSexI18nText(I18nText sexI18nText) {
        this.sexI18nText = sexI18nText;
    }

    public Option getMaleOption() {
        return maleOption;
    }

    public void setMaleOption(Option maleOption) {
        this.maleOption = maleOption;
    }

    public Option getFemaleOption() {
        return femaleOption;
    }

    public void setFemaleOption(Option femaleOption) {
        this.femaleOption = femaleOption;
    }
}
