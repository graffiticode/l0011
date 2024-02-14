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
  const { access_token: accessToken, id: initialId } = router.query || props;
  const [ recompile, setRecompile ] = useState(true);
  const [ height, setHeight ] = useState(0);
  const [ id, setId ] = useState(initialId);
  useEffect(() => {
    setId(initialId);
  }, [initialId]);
  useEffect(() => {
    // If `id` changes, then recompile.
    setRecompile(true);
  }, [id]);

  const [ state ] = useState(createState({}, (data, { type, args }) => {
    console.log("state.apply() type=" + type + " args=" + JSON.stringify(args, null, 2));
    switch (type) {
    case "compiled":
      return {
        ...data,
        ...args,
      };
    case "change":
      setRecompile(true);
      return {
        ...data,
        ...args,
      };
    default:
      console.error(false, `Unimplemented action type: ${type}`);
      return data;
    }
  }));

  const resp = useSWR(
    recompile && accessToken && id && {
      accessToken,
      id,
      data: state.data,
    },
    compile
  );

  console.log("View() resp.data=" + JSON.stringify(resp.data, null, 2));
  if (resp.data) {
    state.apply({
      type: "compiled",
      args: resp.data,
    });
    setRecompile(false);
  }

  // TODO: get id
  useEffect(() => {
    window.parent.postMessage({height, id}, "*");
  }, [height, id]);

  return (
    isNonNullNonEmptyObject(state) &&
      <Form state={state} setHeight={setHeight} /> ||
      <div />
  );
}

export default View;
