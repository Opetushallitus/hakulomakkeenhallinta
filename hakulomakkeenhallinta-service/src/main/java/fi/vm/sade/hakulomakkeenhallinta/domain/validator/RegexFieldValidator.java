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

package fi.vm.sade.hakulomakkeenhallinta.domain.validator;

import fi.vm.sade.hakulomakkeenhallinta.domain.I18nText;
import org.mongodb.morphia.annotations.Embedded;

/**
 * @author Mikko Majapuro
 */
@Embedded
public class RegexFieldValidator implements Validator {

    private String fieldName;
    @Embedded
    private I18nText errorMessage;
    private String pattern;

    public RegexFieldValidator() {}

    public RegexFieldValidator(String fieldName, I18nText errorMessage, String pattern) {
        this.fieldName = fieldName;
        this.errorMessage = errorMessage;
        this.pattern = pattern;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public I18nText getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(I18nText errorMessage) {
        this.errorMessage = errorMessage;
    }
}
