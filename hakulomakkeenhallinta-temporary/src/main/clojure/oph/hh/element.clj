(ns oph.hh.element
  (:require
    [oph.hh.db :as db]
    [clojure.zip :as zip]
    [validateur.validation]))

(defn find-by-id [root id]
  (loop  [loc (zip/zipper #(not (empty? (% :children))) #(% :children) hash-map root)]
    (if (= (:_id (zip/node loc)) id)
      (zip/node loc)
      (if (zip/end? loc)
        nil
        (recur (zip/next loc))))))

(comment (defn update-element [root id element] 
  (loop  [loc (zip/zipper #(not (empty? (% :children))) #(% :children) hash-map root)]
    (if (= (:_id (zip/node loc)) id)
      (zip/edit loc (fn [element] (assoc element :children (:children (zip/node loc)))))
      (if (zip/end? loc)
        nil
        (recur (zip/next loc)))))))

(defn get-ids [root]
  (loop  [loc (zip/zipper #(not (empty? (% :children))) #(% :children) hash-map root)]
    (println (:_id (zip/node loc)))
    (if (zip/end? loc)
      nil
      (recur (zip/next loc)))))

(defn testii []
  (find-by-id (:form (db/application-system "haku4")) "Sukunimi"))

(defn print-ids []
  (get-ids (:form (db/application-system "haku4"))))
