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

package fi.vm.sade.hakulomakkeenhallinta.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

/**
 * @author Mikko Majapuro
 */
public class ApplicationFormCreateParameters implements Serializable {

    private String applicationSystemId;
    private String applicationFormTemplateId;

    public ApplicationFormCreateParameters() {}

    public ApplicationFormCreateParameters(@JsonProperty(value = "applicationSystemId") final String applicationSystemId,
                                           @JsonProperty(value = "applicationFormTemplateId") final String applicationFormTemplateId) {
        this.applicationSystemId = applicationSystemId;
        this.applicationFormTemplateId = applicationFormTemplateId;
    }

    public String getApplicationSystemId() {
        return applicationSystemId;
    }

    public void setApplicationSystemId(String applicationSystemId) {
        this.applicationSystemId = applicationSystemId;
    }

    public String getApplicationFormTemplateId() {
        return applicationFormTemplateId;
    }

    public void setApplicationFormTemplateId(String applicationFormTemplateId) {
        this.applicationFormTemplateId = applicationFormTemplateId;
    }
}
