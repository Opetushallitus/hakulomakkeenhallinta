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
  :method-allowed? (request-method-in :get)
  :available-media-types ["application/json"]
  :handle-ok (db/application-systems))

(defresource update-application-system-form [id]
  :method-allowed? (request-method-in :put)
  :available-media-types ["application/json"]
  :put! (fn [context] {::data (db/update-application-system (request-body context))})
  :etag (fn [context] ((::data context) :modified))
  :new? false
  :handle-ok ::data)

(defresource application-system-form [id]
  :method-allowed? (request-method-in :get)
  :exists? (fn [ctx] (if-let [d (db/application-system id)] {::data d}))
  :etag (fn [ctx] ((::data ctx) :modified))
  :last-modified (fn [ctx] ((::data ctx) :modified))
  :available-media-types ["application/json"]
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



(defroutes api-routes

  (context "/hakulomakkeenhallinta-temporary/application-system-form" []
           (GET  "/" [] (application-system-forms))
           (GET "/:id" [id] (application-system-form id))
           (PUT "/:id" [id] (update-application-system-form id))
           (GET "/:id/form/:eid" [id eid] (get-element id eid)))

  (context "/hakulomakkeenhallinta-temporary/form" []
           (ANY  "/" [] (forms))
           (ANY "/:id" [id] (form id)))

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
