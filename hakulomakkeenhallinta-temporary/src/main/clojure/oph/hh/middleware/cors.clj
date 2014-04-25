(ns oph.hh.middleware.cors)

(defn wrap-cors-origin
  [handler]
  (fn [request]
    (let [response (handler request)]
      (update-in response
                 [:headers "Access-Control-Allow-Origin"]
                 (fn [_] "*")))))

(defn wrap-cors-methods
  [handler]
  (fn [request]
    (let [response (handler request)]
      (update-in response
                 [:headers "Access-Control-Allow-Methods"]
                 (fn [_] "*")))))

(defn wrap-cors-headers
  [handler]
  (fn [request]
    (let [response (handler request)]
      (update-in response
                 [:headers "Access-Control-Allow-Headers"]
                 (fn [_] "*")))))
