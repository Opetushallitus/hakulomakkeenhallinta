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
public class ContainedInOtherFieldValidator implements Validator {

    private String fieldName;
    private String otherFieldName;
    @Embedded
    private I18nText errorMessage;

    public ContainedInOtherFieldValidator() {}

    public ContainedInOtherFieldValidator(String otherFieldName, String fieldName, I18nText errorMessage) {
        this.errorMessage = errorMessage;
        this.otherFieldName = otherFieldName;
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getOtherFieldName() {
        return otherFieldName;
    }

    public void setOtherFieldName(String otherFieldName) {
        this.otherFieldName = otherFieldName;
    }

    public I18nText getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(I18nText errorMessage) {
        this.errorMessage = errorMessage;
    }
}
