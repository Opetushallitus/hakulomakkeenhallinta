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

import com.google.common.collect.Maps;
import org.mongodb.morphia.annotations.Embedded;

import java.util.Iterator;
import java.util.Map;

/**
 * @author Mikko Majapuro
 */
@Embedded
public class I18nText {

    private Map<String, String> translations;

    public I18nText() {}

    public I18nText(final Map<String, String> translations) {
        this.translations = Maps.newHashMap();
        Iterator<Map.Entry<String, String>> i = translations.entrySet().iterator();
        while (i.hasNext()) {
            Map.Entry<String, String> entry = i.next();
            String lang;
            if (entry.getKey().contains("_")) {
                lang = entry.getKey().split("_")[1].toLowerCase();
            } else {
                lang = entry.getKey();
            }
            this.translations.put(lang, entry.getValue());
        }
    }

    public void setTranslations(Map<String, String> translations) {
        this.translations = translations;
    }

    public Map<String, String> getTranslations() {
        return translations;
    }
}
