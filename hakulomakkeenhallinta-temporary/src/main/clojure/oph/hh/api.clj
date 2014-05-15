(ns oph.hh.api
  (:use compojure.core
        liberator.core
        [clojure.string :only (split)])
  (:require [compojure.route :as route]
            [compojure.handler :as handler]
            [oph.hh.db :as db]
            [oph.hh.element :as element]
            [oph.hh.middleware.cors :as cors]
            [ring.middleware.params :as params]
            [ring.middleware.json :as middleware]))

(defn- request-body [context]
  (get-in context [:request :body]))


(defn check-content-type [ctx content-types]
  (if (#{:put :post} (get-in ctx [:request :request-method]))
    (or
      (some #{(get-in ctx [:request :headers "content-type"])}
            content-types)
      [false {:message "Unsupported Content-Type"}])
    true))

(defresource forms []
  :allowed-methods [:post :get :options]
  :available-media-types ["application/json"]
  :known-content-type? #(check-content-type % ["application/json" "text/plain"])
  :post! (fn [context]
           (db/save-form (request-body context)))
  :handle-ok ( db/list-forms ))

(defresource form [id]
  :allowed-methods [:get :put :delete :options]
  :available-media-types ["application/json"]
  :can-put-to-missing? false
  :known-content-type? #(check-content-type % ["application/json"])
  :exists? (fn [ctx] (if-let [form (db/form id)] {::form form}))
  :put! (fn [context] (db/save-form (request-body context)))
  :delete! (fn [context] (db/delete-form id))
  :handle-ok ::form)

(defresource application-system-forms []
  :method-allowed? (request-method-in :get :post :options)
  :available-media-types ["application/json"]
  :known-content-type? #(check-content-type % ["application/json" "application/json;charset=UTF-8"])
  :post! (fn [ctx] {::asf  (db/add-new-application-system-form (request-body ctx))})
  :post-redirect? true
  :location (fn [ctx] (println (::asf ctx)) (:_id (::asf ctx)))
  :handle-ok (db/application-systems))

(defresource application-system-form [id]
  :method-allowed? (request-method-in :get :put :delete :options)
  :available-media-types ["application/json"]
  :known-content-type? #(check-content-type % ["application/json"])
  :exists? (fn [ctx] (if-let [d (db/application-system id)] {::data d}))
  :etag (fn [ctx] ((::data ctx) :modified))
  :put! (fn [context] {::data (db/update-application-system (request-body context))})
  :last-modified (fn [ctx] ((::data ctx) :modified))
  :delete! (fn [context] ((println (str "delete" id))) (db/delete-application-system-form id))
  :new? false
  :handle-ok ::data)

(defresource get-element [id eid]
  :method-allowed? (request-method-in :get)
  :exists? (fn [ctx]
             (if-let [as (db/application-system id)]
               (if-let [e (element/find-by-id  (:form as) eid)] {::as as ::e e})))
  :etag (fn [ctx] ((::as ctx) :modified))
  :last-modified (fn [ctx] ((::as ctx) :modified))
  :available-media-types ["application/json"]
  :handle-ok ::e)

(def types (list
             {"id" "TextQuestion" "name" {"translations" {"fi" "Avoin kysymys"}} :modified (System/currentTimeMillis)}
             {"id" "OptionQuestion" "name" {"translations" {"fi" "Valinta (yksi vastaus)"}} :modified (System/nanoTime)}
             {"id" "HelpOrInfoQuestion" "name" {"translations" {"fi" "Ohje- tai infoteksti"}} :modified (System/nanoTime)}))

(defresource element-types []
  :method-allowed? (request-method-in :get)
  :available-media-types ["application/json"]
  :handle-ok types)

(defresource element-type [id]
  :method-allowed? (request-method-in :get)
  :exists? (fn [ctx] (if-let [t (first (filter #(= id (% "id")) types))] {::t t}))
  :available-media-types ["application/json"]
  :etag (fn [ctx] ((::t ctx) :modified))
  :last-modified (fn [ctx] ((::t ctx) :modified))
  :handle-ok ::t)

(def langs (list
 { "id" "fi" "i18nText" { "translations" { "fi" "Suomi" "sv" "Suomi (sv)" } }}
 { "id" "sv" "i18nText" { "translations" { "fi" "Ruotsi" "sv" "Ruotsi (sv)" } }}))

(defresource languages []
  :method-allowed? (request-method-in :get)
  :available-media-types ["application/json"]
  :handle-ok langs)

(defroutes api-routes

  (context "/hakulomakkeenhallinta-temporary/application-system-form" []
           (ANY  "/" [] (application-system-forms))
           (ANY "/:id" [id] (application-system-form id))
           (GET "/:id/form/:eid" [id eid] (get-element id eid)))

  (context "/hakulomakkeenhallinta-temporary/form" []
           (ANY  "/" [] (forms))
           (ANY "/:id" [id] (form id)))

  (context "/hakulomakkeenhallinta-temporary/type" []
           (ANY  "/" [] (element-types))
           (ANY "/:id" [id] (element-type id)))

  (context "/hakulomakkeenhallinta-temporary/languages" []
           (ANY  "/" [] (languages)))

  (route/resources "")
  (route/not-found "Resource not found!"))

(def all-routes
  (-> (handler/api api-routes)
      (middleware/wrap-json-body)
      (params/wrap-params)
      (middleware/wrap-json-response)
      (cors/wrap-cors-methods)
      (cors/wrap-cors-headers)
      (cors/wrap-cors-origin)))
