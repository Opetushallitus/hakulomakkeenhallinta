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

import java.util.Map;

/**
 * @author Mikko Majapuro
 */
@Embedded
public class PostalCode extends Element {

    @Embedded
    private I18nText i18nText;
    private String name;
    @Embedded
    private Map<String, PostOffice> data;
    private Integer size;
    private String placeHolder;

    public PostalCode() {}

    public PostalCode(final String id, final String name, final I18nText i18nText, final Map<String, PostOffice> data,
                      final Integer size) {
        super(id);
        this.name = name;
        this.i18nText = i18nText;
        this.data = data;
        this.size = size;
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

    public Map<String, PostOffice> getData() {
        return data;
    }

    public void setData(Map<String, PostOffice> data) {
        this.data = data;
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
}
