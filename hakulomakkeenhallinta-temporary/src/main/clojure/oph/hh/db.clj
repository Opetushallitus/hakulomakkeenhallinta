(ns oph.hh.db
  (:require
    [monger.core :as mg :only [insert find-map-by-id]]
    [monger.query :as mq :only [limit]]
    [monger.collection :as mc :only [connect! set-db! find-and-modify]]
    [clojure.zip :as zip]
    [monger.json])
  (:use validateur.validation))

(def database "hakulomake")
(def application-system-collection "applicationSystem")
(def form-collection "form")

(defn connect! [url]
  "Connect to db"
  (mg/connect-via-uri! url)
  (mg/set-db! (mg/get-db database))
  (mc/ensure-index application-system-collection [ "modified"]))

(defn disconnect! []
  "Close db connection"
  mg/disconnect!)

(defn exists? [id version]
  (mc/any? application-system-collection {"_id" id "modified" version}))

(defn application-systems
  ([]  (mc/find-maps application-system-collection {} [:_id :name :_class]))
  ([query]  (mc/find-maps application-system-collection query [:_id :name]))
  ([query fields]  (mc/find-maps application-system-collection query fields)))

(defn application-system
  ([id] ( mc/find-map-by-id application-system-collection id))
  ([id fields] ( mc/find-map-by-id application-system-collection id fields)))

(defn update-application-system [application-system]
  (let [query (select-keys application-system ["_id" "modified"])]
    (println query)
   (mc/find-and-modify
     application-system-collection
     query
     (assoc application-system "modified" (System/nanoTime))
     :return-new true)))


(defn form [id]
  (mc/find-map-by-id form-collection id))

(defn delete-form  [id]
  (mc/remove-by-id form-collection id))

(defn list-forms
  ([] (mc/find-maps form-collection {} [:_id :_class :name :i18nText]))
  ([query]  (mc/find-maps form-collection query [:_id :name]))
  ([query fields]  (mc/find-maps form-collection query fields)))

(defn save-form [form]
  (mc/insert-and-return form-collection form))

(defn add-new-application-system-form [asf]
  (println "==== " (asf "applicationSystem"))
  (mc/insert-and-return application-system-collection (assoc (asf "applicationSystem") "form" (form ( "_id" (asf "applicationFormTemplate"))))))
(defn create-templates []
  (map (fn [id] (save-form (dissoc (:form (application-system (:_id id)) [:_id]))))  (application-systems {} [:_id])))
