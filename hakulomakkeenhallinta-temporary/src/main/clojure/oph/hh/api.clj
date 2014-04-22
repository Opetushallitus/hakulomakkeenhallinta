(ns oph.hh.api
  (:use compojure.core
        liberator.core)
  (:require [compojure.route :as route]
            [compojure.handler :as handler]
            [oph.hh.db :as db]
            [oph.hh.middleware.cors :as cors]
            [ring.middleware.json :as middleware]))

(defresource application-system-forms []
  :method-allowed? (request-method-in :get)
  :available-media-types ["application/json"]
  :handle-ok (db/application-systems))

(defresource update-application-system-form [id]
  :method-allowed? (request-method-in :put)
  :available-media-types ["application/json"]
  :put! (fn [context] (println "put!") {::data (db/update-application-system (get-in context [:request :body]))})
  :etag (fn [context] (println (str "modified " (get (::data context) "name") " mättää")) ((::data context) "modified"))
  :new? false
  :handle-ok ::data)

(defresource application-system-form [id]
  :method-allowed? (request-method-in :get)
  :exists? (fn [ctx] (if-let [d (db/application-system id)] {::data d}))
  :available-media-types ["application/json"]
  :handle-ok ::data)

(defroutes api-routes
  (context "/hakulomakkeenhallinta-temporary/application-system-form" []
           (GET  "/" [] (application-system-forms))
           (GET "/:id" [id] (application-system-form id))
           (PUT "/:id" [id] (update-application-system-form id)))

  (route/resources "")
  (route/not-found "Resource not found!"))

(def all-routes
  (-> (handler/api api-routes)
      (middleware/wrap-json-body)
      (middleware/wrap-json-response)
      (cors/wrap-cors)))
