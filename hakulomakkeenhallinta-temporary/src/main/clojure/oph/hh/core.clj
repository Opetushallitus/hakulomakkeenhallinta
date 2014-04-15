(ns oph.hh.core
  (:use compojure.core)
  (:use ring.adapter.jetty)
  (:require [compojure.route :as route]
            [oph.hh.api :as api]
            [oph.hh.db :as db]
            [ring.middleware.params :refer [wrap-params]]))

(defn boot []
  (run-jetty #'api/all-routes {:port 8080 :join? false}))


