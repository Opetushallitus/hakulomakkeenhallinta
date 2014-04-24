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

(defresource form []
  :allowed-methods [:post :get]
  :available-media-types ["application/json"]
  :post! (fn [context]
           (db/save-form (request-body context)))
  :handle-ok ( db/list-forms ))

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
           (ANY  "/" [] (form)))

  (route/resources "")
  (route/not-found "Resource not found!"))

(def all-routes
  (-> (handler/api api-routes)
      (middleware/wrap-json-body)
      (params/wrap-params)
      (middleware/wrap-json-response)
      (cors/wrap-cors)))
