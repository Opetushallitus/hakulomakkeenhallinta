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

package fi.vm.sade.hakulomakkeenhallinta.domain.rule;

import fi.vm.sade.hakulomakkeenhallinta.domain.Element;
import org.mongodb.morphia.annotations.Embedded;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Mikko Majapuro
 */
@Embedded
public class RelatedQuestionRule extends Element {

    private String expression;
    private List<String> relatedElementId;
    private boolean showImmediately;

    public RelatedQuestionRule() {}
    public RelatedQuestionRule(final String id) {
        super(id);
        this.relatedElementId = new ArrayList<String>();
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public List<String> getRelatedElementId() {
        return relatedElementId;
    }

    public void setRelatedElementId(List<String> relatedElementId) {
        this.relatedElementId = relatedElementId;
    }

    public boolean isShowImmediately() {
        return showImmediately;
    }

    public void setShowImmediately(boolean showImmediately) {
        this.showImmediately = showImmediately;
    }
}
