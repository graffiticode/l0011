import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Form } from "./components";
import { createState } from "./lib/state";
import { compile } from './swr/fetchers';
import './index.css';

function isNonNullNonEmptyObject(obj) {
  return (
    typeof obj === "object" &&
      obj !== null &&
      Object.keys(obj).length > 0
  );
}

export const View = () => {
  const [ id, setId ] = useState();
  const [ accessToken, setAccessToken ] = useState();
  const [ targetOrigin, setTargetOrigin ] = useState(null);
  const [ doRecompile, setDoRecompile ] = useState(false);
  const [ state ] = useState(createState({}, (data, { type, args }) => {
    // console.log("L0011 state.apply() type=" + type + " args=" + JSON.stringify(args, null, 2));
    switch (type) {
    case "init":
      setDoRecompile(true);
      return {
        ...args,
      };
    case "compile":
      return {
        ...data,
        ...args,
      };
    case "update":
      setDoRecompile(true);
      return {
        ...data,
        ...args,
      };
    default:
      console.error(false, `Unimplemented action type: ${type}`);
      return data;
    }
  }));

  useEffect(() => {
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      setId(params.get("id"));
      setAccessToken(params.get("access_token"));
      setTargetOrigin(params.get("origin"));
      const data = params.get("data");
      if (data) {
        state.apply({
          type: "init",
          args: JSON.parse(data),
        });
      }
    }
  }, [window.location.search]);

  useEffect(() => {
    // If `id` changes, then recompile.
    if (id) {
      setDoRecompile(true);
    }
  }, [id]);

  useEffect(() => {
    if (id && targetOrigin) {
      window.parent.postMessage({ [id]: state.data }, targetOrigin);
    }
  }, [JSON.stringify(state.data)]);

  const compileResp = useSWR(
    doRecompile && accessToken && id && {
      accessToken,
      id,
      data: state.data,
    },
    compile
  );

  if (compileResp.data) {
    state.apply({
      type: "compile",
      args: compileResp.data,
    });
    setDoRecompile(false);
  }

  return (
    isNonNullNonEmptyObject(state.data) &&
      <Form state={state} /> ||
      <div />
  );
}
