// SPDX-License-Identifier: MIT
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Form } from "./components";
import { createState } from "./lib/state";
import { compile } from './swr/fetchers';
import './index.css';

// The compiled data field can be a record, a non-empty array, or a bare value
// (number, string). Render whenever there is something to show.
function hasRenderableData(data) {
  if (data === null || data === undefined) {
    return false;
  }
  if (typeof data === "object") {
    return Object.keys(data).length > 0;
  }
  return true;
}

// Compile/stored responses use the standard { data, errors } envelope. A
// response carrying a `data` and/or `errors` field is read as an envelope; a
// payload with neither (legacy/raw value or host-provided init data) is used
// as the data model itself.
function unwrapEnvelope(resp) {
  if (
    resp && typeof resp === "object" && !Array.isArray(resp) &&
    ("data" in resp || "errors" in resp)
  ) {
    return {
      data: resp.data,
      errors: Array.isArray(resp.errors) ? resp.errors : [],
    };
  }
  return { data: resp, errors: [] };
}

export const View = () => {
  const [ id, setId ] = useState();
  const [ accessToken, setAccessToken ] = useState();
  const [ targetOrigin, setTargetOrigin ] = useState(null);
  const [ doRecompile, setDoRecompile ] = useState(false);
  const [ state ] = useState(createState({}, (data, { type, args }) => {
    // console.log(
    //   "L0011 state.apply()",
    //   "type=" + type,
    //   "args=" + JSON.stringify(args, null, 2),
    // );
    switch (type) {
    case "init":
      setDoRecompile(true);
      return {
        ...args,
      };
    case "compile":
      // A record merges into existing state; a non-record result (number,
      // string, list) replaces it.
      if (typeof args === "object" && args !== null && !Array.isArray(args)) {
        return {
          ...data,
          ...args,
        };
      }
      return args;
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
    if (targetOrigin) {
      const data = {
        ...state.data,
        schema: undefined,
      };
      window.parent.postMessage({ "0011": data }, targetOrigin);
    }
  }, [JSON.stringify(state.data)]);

  const compileResp = useSWR(
    doRecompile && id && {
      accessToken,
      id,
      data: state.data,
    },
    compile
  );

  if (compileResp.data) {
    // Unwrap the { data, errors } envelope (tolerates legacy raw payloads).
    const { data, errors } = unwrapEnvelope(compileResp.data);
    state.setErrors(errors);
    if (errors.length === 0 && data !== null && data !== undefined) {
      state.apply({
        type: "compile",
        args: data,
      });
    }
    setDoRecompile(false);
  }

  return (
    (hasRenderableData(state.data) || state.errors.length > 0) &&
      <Form state={state} /> ||
      <div />
  );
}
