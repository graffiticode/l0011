import React, { useState, useEffect } from 'react'; React;
import { Switch } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function renderErrors(errors: { message: string; from: number; to: number }[]) {
  return (
    <div className="flex flex-col gap-2">
      {errors.map((error, i) => (
        <div
          key={i}
          className="rounded-md p-3 border text-sm bg-red-50 border-red-200 text-red-800"
        >
          {error.message}
        </div>
      ))}
    </div>
  );
}

function Text({ value, onChange }) {
  const [ currentValue, setCurrentValue ] = useState(value || "");

  useEffect(() => {
    setCurrentValue(value || "");
  }, [value]);

  return (
    <div>
      <label htmlFor="email" className="sr-only">
        Text
      </label>
      <input
        type="text"
        name="text"
        id="text"
        className="block w-full rounded-none border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 px-3 focus:outline-none"
        value={currentValue}
        onChange={e => setCurrentValue(e.target.value)}
        onBlur={() => onChange(currentValue)}
      />
    </div>
  )
}

function Toggle({ disabled, value: enabled, onChange }) {
  const [checked, setChecked] = useState(enabled)
  useEffect(() => {
    setChecked(enabled);
  }, [enabled]);
  useEffect(() => {
    onChange(checked);
  }, [checked]);
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={checked}
        disabled={disabled}
        onChange={setChecked}
        className={classNames(
          checked ? 'bg-gray-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-none border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            checked ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-none bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  )
}

const optionsFromList = list => list.map((name, id) => ({id, name}));

function Combo({ value = "", list, onChange }) {
  const [ options ] = useState(optionsFromList(list));
  const [ query, setQuery ] = useState('')
  const [ selectedOption, setSelectedOption ] = useState(
    options.find(option => option.name === value)
  );

  useEffect(() => {
    setSelectedOption(options.find(option => option.name === value));
  }, [value]);

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase())
      });

  useEffect(() => {
    if (selectedOption) {
      onChange(selectedOption.name);
    }
  }, [selectedOption]);

  return (
    <Combobox as="div" value={selectedOption} onChange={setSelectedOption}>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-none border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 focus:outline-none"
          onChange={
            (event) => (
              setQuery(event.target.value)
            )
          }
          displayValue={
            (option: any) => option.name
          }
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-none bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option.name}
                value={option}
                className={({ active }) =>
                  classNames(
                    'z-100 relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-gray-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      key="1"
                      className={
                        classNames('block truncate', selected && 'font-semibold')}>
                      {option.name}
                    </span>
                    {selected && (
                      <span
                        key="2"
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-gray-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}

function Props({ state, initialData }) {
  const data = state.data;
  // console.log(
  //   "Props()",
  //   "data=" + JSON.stringify(data, null, 2),
  //   "initialData=" + JSON.stringify(initialData, null, 2),
  // );
  const schema = data.schema;
  // Merge initial data with state data
  const mergedData = { ...initialData, ...data };
  const propDefs = schema?.properties || {};
  const fields = Object.keys(propDefs).map(key => {
    if (mergedData[key] === undefined && !propDefs[key].default) {
      return undefined;
    }
    const propDef = propDefs[key];
    return {
      name: key,
      desc: propDef.description,
      type: propDef.type,
      input: {type: "Text", values: mergedData[key] || propDefs[key].default || ""},
    };
  }).filter(field => field !== undefined);
  const handleChange = args => {
    const props = {};
    Object.keys(propDefs).forEach(key => {
      if (mergedData[key] !== undefined) {
        // We have a value for this prop, so capture it.
        props[key] = mergedData[key];
      }
    });
    state.apply({
      type: "update",
      args: {
        ...props,
        ...args,
      },
    });
  };

  return (
    <div className="p-2">
      <div className="px-4 py-6 font-light grid grid-cols-1 md:grid-cols-5 text-sm">
        {
          fields.map((field) => {
            const propDef = propDefs[field.name];
            return (
              <>
                <div key={field.name + "1"} className="font-mono pt-4 md:pt-0">{field.name}</div>
                <div key={field.name + "2"} className="col-span-1 md:col-span-3 text-gray-500 pb-2">{field.desc}<br/><span className="font-mono p-1 rounded-none bg-gray-100 text-xs">{field.type}</span></div>
                <div key={field.name + "3"} className="col-span-1">
                  {
                    propDef.enum &&
                      <Combo
                        list={propDef.enum}
                        value={mergedData[field.name]}
                        onChange={(value) => handleChange({[field.name]: value})}
                      /> ||
                      propDef.type === "boolean" &&
                      <Toggle
                        disabled={false}
                        value={mergedData[field.name]}
                        onChange={(value) => handleChange({[field.name]: value})}
                      /> ||
                      <Text
                        value={mergedData[field.name] || ""}
                        onChange={(value) => handleChange({[field.name]: value})}
                      />
                  }
                </div>
              </>
            );
          })
        }
      </div>
    </div>
  )
}

export const Form = ({ state, data: initialData }) => {
  if (Array.isArray(state.data.errors) && state.data.errors.length > 0) {
    return renderErrors(state.data.errors);
  }
  return (
    <Props state={state} initialData={initialData} />
  );
}
