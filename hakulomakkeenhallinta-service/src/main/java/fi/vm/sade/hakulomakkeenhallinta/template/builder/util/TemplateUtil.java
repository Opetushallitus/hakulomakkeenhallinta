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

package fi.vm.sade.hakulomakkeenhallinta.template.builder.util;

import com.google.common.base.Preconditions;
import fi.vm.sade.hakulomakkeenhallinta.domain.I18nText;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.MessageFormat;
import java.util.*;

/**
 * @author Mikko Majapuro
 */
public class TemplateUtil {

    public static final Logger LOG = LoggerFactory.getLogger(TemplateUtil.class);
    private static final String[] LANGS = {"fi", "sv"};

    public static I18nText createI18NForm(final String text, final String... params) {
        return createI18NText(text, "form_messages", params);
    }

    public static I18nText createI18NTextError(final String text, final String... params) {
        return createI18NText(text, "form_errors", params);
    }

    private static I18nText createI18NText(final String key, final String bundleName, final String... params) {
        Preconditions.checkNotNull(key, "key can't be null");
        Preconditions.checkNotNull(bundleName, "bundleName can't be null");

        Map<String, String> translations = new HashMap<String, String>();
        for (String lang : LANGS) {
            ResourceBundle bundle = ResourceBundle.getBundle(bundleName, new Locale(lang));

            String text = "";
            try {
                if (key != null) {
                    text = bundle.getString(key);
                }
                if (params != null && params.length > 0) {
                    text = MessageFormat.format(text, (Object[]) params);
                }
            } catch (MissingResourceException mre) {
                text = key + " [" + lang + "]";
                LOG.warn("No translation found for key '" + key + "' in " + lang);
            }
            translations.put(lang, text);
        }
        return new I18nText(translations);
    }
}
