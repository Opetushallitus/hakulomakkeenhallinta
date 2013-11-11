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
public class Option {

    @Embedded
    private I18nText i18nText;
    private String value;
    private boolean defaultOption = false;
    @Embedded
    private I18nText help;

    public Option() {}

    public Option(final I18nText i18nText, final String value) {
        this.i18nText = i18nText;
        this.value = value;
    }

    public I18nText getI18nText() {
        return i18nText;
    }

    public void setI18nText(I18nText i18nText) {
        this.i18nText = i18nText;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public boolean isDefaultOption() {
        return defaultOption;
    }

    public void setDefaultOption(boolean defaultOption) {
        this.defaultOption = defaultOption;
    }

    public I18nText getHelp() {
        return help;
    }

    public void setHelp(I18nText help) {
        this.help = help;
    }
}
