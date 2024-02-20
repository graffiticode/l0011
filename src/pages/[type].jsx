/*

  data = { schema, props }

  Get the schema from the static schema.json.
  Get the props from the state of the form.
  The property editor will delete the schema and post the rest of the data
  to the state of the editor.
  
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { compile } from '../swr/fetchers';
import useSWR from 'swr';
import { Form } from "../components/form";
import { createState } from "../lib/state";

function isNonNullNonEmptyObject(obj) {
  return (
    typeof obj === "object" &&
      obj !== null &&
      Object.keys(obj).length > 0
  );
}

const View = (props) => {
  const router = useRouter();
  const { access_token: accessToken, id } = router.query || props;
  const [ doCompile, setDoCompile ] = useState(false);
  const [ height, setHeight ] = useState(0);
  const [ newId, setNewId ] = useState(id);

  // Post id across iframe boundary.
  useEffect(() => {
    window.parent.postMessage({id: newId}, "*");
  }, [newId]);

  useEffect(() => {
    window.parent.postMessage({height}, "*");
  }, [height]);

  useEffect(() => {
    // If `id` changes, then doCompile.
    setNewId(id);
    setDoCompile(true);
  }, [id]);

  const [ state ] = useState(createState({}, (data, { type, args }) => {
    console.log("L0011 state.apply() type=" + type + " args=" + JSON.stringify(args, null, 2));
    switch (type) {
    case "compile":
      setDoCompile(false);
      return {
        ...data,
        ...args,
      };
    case "change":
      setDoCompile(true);
      return {
        ...data,
        ...args,
      };
    default:
      console.error(false, `Unimplemented action type: ${type}`);
      return data;
    }
  }));

  const compileResp = useSWR(
    doCompile && accessToken && newId && {
      accessToken,
      id: newId,
      data: {}, //state.data,
    },
    compile
  );

  if (compileResp.data) {
    const { id, data } = compileResp.data;
    console.log("L0011 [type] id=" + id + " data=" + JSON.stringify(data, null, 2));
    state.apply({
      type: "compile",
      args: data,
    });
    setNewId(id);
  }

  return (
    isNonNullNonEmptyObject(state) &&
      <Form state={state} setHeight={setHeight} /> ||
      <div />
  );
}

export default View;
