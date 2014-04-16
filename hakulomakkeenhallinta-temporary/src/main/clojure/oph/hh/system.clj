(ns oph.hh.system
  (:require [org.lpetit.ring.servlet.util :as util]
            [oph.hh.db :as db]
            [oph.hh.api :as api]
            [ring.adapter.jetty :as jetty]))


(defn start-up [ctx]
  (db/connect)
  (println "Starting app with params: " (util/context-params ctx)))

(defn shutdown [ctx]
  (println "Stopping app with params: " (util/context-params ctx)))

(defn boot []
  (jetty/run-jetty #'api/all-routes {:port 8080 :join? false}))


