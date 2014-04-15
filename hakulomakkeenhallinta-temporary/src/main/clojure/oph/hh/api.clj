(ns oph.hh.api
  (:use compojure.core
        liberator.core)
  (:require [compojure.route :as route]
            [compojure.handler :as handler]
            [fi.oph.sade.hakulomakkeenhallinta.db :as db]
            [ring.middleware.json :as middleware]))

(defn wrap-cors
  "Allow requests from all origins"
  [handler]
  (fn [request]
    (let [response (handler request)]
      (update-in response
                 [:headers "Access-Control-Allow-Origin"]
                 (fn [_] "*")))))

(defresource application-system-forms []
  :method-allowed? (request-method-in :get)
  :available-media-types ["application/json"]
  :handle-ok (db/application-systems))

(defresource application-system-form [id]
  :method-allowed? (request-method-in :get)
  :available-media-types ["application/json"]
  :handle-ok (db/application-system id))

(defroutes api-routes

  (context "/hakulomakkeenhallinta-temporary/application-system-form" []
          (GET "/" [] (application-system-forms))
          (GET "/:id" [id] (application-system-form id)))

  (route/resources "")
  (route/not-found "Resource not found!"))

(def all-routes
  (-> (handler/api api-routes)
      (middleware/wrap-json-body)
      (middleware/wrap-json-response)
      (wrap-cors)))
