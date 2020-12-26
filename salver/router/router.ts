import { useState, useEffect } from "react";
import { on, off } from "../../shared/evt-bus";
import { pushHistory, getCurRoute, EventAfterRouteChanged } from "../app";
import { Route } from "../app/util";

function useRouter(): [Route, typeof pushHistory] {
  const [route, setRoute] = useState<Route>(getCurRoute());

  useEffect(() => {
    function handleRouteChange() {
      setRoute(getCurRoute());
    }
    handleRouteChange();

    on(EventAfterRouteChanged, handleRouteChange);
    return () => {
      off(EventAfterRouteChanged, handleRouteChange);
    };
  }, []);

  return [route, pushHistory];
}

export { pushHistory, getCurRoute, useRouter };
