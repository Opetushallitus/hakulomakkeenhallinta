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

import fi.vm.sade.hakulomakkeenhallinta.domain.validator.Validator;
import org.mongodb.morphia.annotations.Embedded;
import org.mongodb.morphia.annotations.Id;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Mikko Majapuro
 */
@Embedded
public class Element {

    @Id
    private String id;
    @Embedded
    private List<Element> children;
    @Embedded
    private List<Validator> validators;
    @Embedded
    private I18nText help;
    @Embedded
    private I18nText verboseHelp;
    @Embedded
    private Element popup;

    public Element() {}

    public Element(final String id) {
        this.id = id;
        this.children = new ArrayList<Element>();
        this.validators = new ArrayList<Validator>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Element> getChildren() {
        return children;
    }

    public void setChildren(List<Element> children) {
        this.children = children;
    }

    public List<Validator> getValidators() {
        return validators;
    }

    public void setValidators(List<Validator> validators) {
        this.validators = validators;
    }

    public I18nText getHelp() {
        return help;
    }

    public void setHelp(I18nText help) {
        this.help = help;
    }

    public I18nText getVerboseHelp() {
        return verboseHelp;
    }

    public void setVerboseHelp(I18nText verboseHelp) {
        this.verboseHelp = verboseHelp;
    }

    public Element getPopup() {
        return popup;
    }

    public void setPopup(Element popup) {
        this.popup = popup;
    }
}
