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

import java.util.ArrayList;
import java.util.List;

/**
 * @author Mikko Majapuro
 */
@Embedded
public class Radio extends Element {

    @Embedded
    private I18nText i18nText;
    private String name;
    @Embedded
    private List<Option> options;

    public Radio() {}

    public Radio(final String id, final I18nText i18nText, final String name) {
        super(id);
        this.i18nText = i18nText;
        this.name = name;
        this.options = new ArrayList<Option>();
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

    public List<Option> getOptions() {
        return options;
    }

    public void setOptions(List<Option> options) {
        this.options = options;
    }
}
