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
public class RequiredFieldValidator implements Validator {

    private String fieldName;
    @Embedded
    private I18nText errorMessage;

    public RequiredFieldValidator() {}

    public RequiredFieldValidator(final String fieldName, final I18nText errorMessage) {
        this.fieldName = fieldName;
        this.errorMessage = errorMessage;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public I18nText getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(I18nText errorMessage) {
        this.errorMessage = errorMessage;
    }
}
