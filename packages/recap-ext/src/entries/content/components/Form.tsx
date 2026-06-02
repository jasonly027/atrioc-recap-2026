import {
  useId,
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
} from "react";
import schema from "../../../../../../static/dataset-schema.json";
import { useRef } from "#imports";
import type { StatePair } from "../lib";

export function FormDivider() {
  return <hr className="border-white/20" />;
}

export function FormSubmit(props: ComponentProps<"button">) {
  return (
    <button
      type="submit"
      className="px-6 cursor-pointer bg-purple-900/20 py-2 border border-white/20 rounded-xl"
      {...props}
    >
      Copy
    </button>
  );
}

export function FormDate(props: ComponentProps<"input">) {
  return (
    <div className="flex flex-row gap-2">
      <label>Date</label>
      <input
        type="text"
        placeholder="YYYY-MM-DD"
        pattern="\d{4}-\d{2}-\d{2}"
        required
        className="px-2 border border-white/20 rounded-2xl "
        {...props}
      />
    </div>
  );
}

export function FormHats({
  setSelected,
}: Pick<ComponentProps<typeof FormMultiSelect>, "setSelected">) {
  const hats = schema.properties.vods.items.properties.hats.items.enum;
  return (
    <FormMultiSelect setSelected={setSelected} label="Hats" values={hats} />
  );
}

export function FormCategories({
  setSelected,
}: Pick<ComponentProps<typeof FormMultiSelect>, "setSelected">) {
  const categories =
    schema.properties.vods.items.properties.categories.items.enum;
  return (
    <FormMultiSelect
      setSelected={setSelected}
      label="Categories"
      values={categories}
      required
    />
  );
}

function FormMultiSelect({
  label,
  values,
  setSelected,
  ...props
}: {
  label: string;
  values: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
} & ComponentProps<"select">) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-center">{label}</label>
      <select
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions).map(
            (o) => o.value,
          );
          setSelected(selected);
        }}
        multiple
        className="border border-white/20 p-2 rounded-2xl [&::-webkit-scrollbar]:hidden"
        {...props}
      >
        {values.map((value) => (
          <option value={value}>{value}</option>
        ))}
      </select>
    </div>
  );
}

export function FormYokCounter(props: Omit<FormCounterProps, "label">) {
  return <FormCounter label="YOK" {...props} />;
}

export function FormPlaidShirtCounter(props: Omit<FormCounterProps, "label">) {
  return <FormCounter label="Plaid Shirts" {...props} />;
}

export function FormGssCounter(props: Omit<FormCounterProps, "label">) {
  return <FormCounter label="GSS" {...props} />;
}

interface FormCounterProps {
  label: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}

function FormCounter({ label, value, setValue }: FormCounterProps) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <label>{label}</label>
      <button
        type="button"
        onClick={() => setValue((v) => v - 1)}
        className="py-2 w-16 text-center text-2xl rounded-xl font-extrabold border border-white/20 cursor-pointer"
      >
        -
      </button>
      {value}
      <button
        type="button"
        onClick={() => setValue((v) => v + 1)}
        className="py-2 w-16 text-2xl text-center rounded-xl font-extrabold border border-white/20 cursor-pointer"
      >
        +
      </button>
    </div>
  );
}

export function FormNotablePeople({
  values,
  setValues,
}: Pick<ComponentProps<typeof FormInputSuggest>, "values" | "setValues">) {
  const suggests =
    schema.properties.vods.items.properties.notablePeople.items.enum;
  return (
    <FormInputSuggest
      values={values}
      setValues={setValues}
      label="Notable People"
      suggests={suggests}
    />
  );
}

export function FormGssCreators({
  values,
  setValues,
}: Pick<ComponentProps<typeof FormInputSuggest>, "values" | "setValues">) {
  const suggests =
    schema.properties.vods.items.properties.gssCreators.items.enum;
  return (
    <FormInputSuggest
      values={values}
      setValues={setValues}
      label="GSS Creators"
      suggests={suggests}
    />
  );
}

export function FormCollabs({
  values,
  setValues,
}: Pick<ComponentProps<typeof FormInputSuggest>, "values" | "setValues">) {
  const suggests = schema.properties.vods.items.properties.collabs.items.enum;
  return (
    <FormInputSuggest
      values={values}
      setValues={setValues}
      label="Collabs"
      suggests={suggests}
    />
  );
}

function FormInputSuggest({
  values,
  setValues,
  label,
  suggests,
}: {
  values: string[];
  setValues: Dispatch<SetStateAction<string[]>>;
  label: string;
  suggests: string[];
}) {
  const optionsId = useId();

  const remainingSuggests = suggests.filter(
    (suggest) => !values.includes(suggest),
  );

  const onRemove = (idx: number) => {
    setValues((prev) => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-center">{label}</label>

      <div className="flex flex-col gap-1">
        {values.map((value, idx) => (
          <div key={value} className="flex flex-row gap-2">
            <span className="px-2 border border-white/20 w-full rounded-2xl">
              {value}
            </span>
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="rounded-xl border border-white/20 cursor-pointer py-2 px-6 font-extrabold text-2xl text-red-400"
            >
              X
            </button>
          </div>
        ))}

        <input
          onKeyDown={(e) => {
            const input = e.target as HTMLInputElement;
            if (e.key === "Enter" && remainingSuggests.includes(input.value)) {
              setValues((prev) => {
                const next = [...prev, input.value];
                input.value = "";
                return next;
              });
            }
          }}
          list={optionsId}
          type="text"
          className="px-2 border border-white/20 rounded-2xl"
        />
      </div>

      <datalist id={optionsId}>
        {remainingSuggests.map((suggest) => (
          <option value={suggest} />
        ))}
      </datalist>
    </div>
  );
}

export function FormPerAtrioc({
  values,
  setValues,
}: {
  values: string[];
  setValues: Dispatch<SetStateAction<string[]>>;
}) {
  const onRemove = (idx: number) => {
    setValues((prev) => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-center">Per Atrioc</label>

      <div className="flex flex-col gap-1">
        {values.map((value, idx) => (
          <div key={value} className="flex flex-row gap-2">
            <input
              value={value}
              onChange={({ currentTarget: { value } }) => {
                setValues((prev) => {
                  const next = [...prev];
                  next[idx] = value;
                  return next;
                });
              }}
              required
              className="px-2 border border-white/20 w-full rounded-2xl"
            />
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="rounded-xl border border-white/20 cursor-pointer py-2 px-6 font-extrabold text-2xl text-red-400"
            >
              X
            </button>
          </div>
        ))}

        <input
          onKeyDown={(e) => {
            const input = e.target as HTMLInputElement;
            if (e.key === "Enter") {
              setValues((prev) => {
                const next = [...prev, input.value];
                input.value = "";
                return next;
              });
            }
          }}
          placeholder="Quote"
          type="text"
          className="px-2 border border-white/20 rounded-2xl"
        />
      </div>
    </div>
  );
}

export function FormWooshed({
  values,
  setValues,
}: {
  values: string[];
  setValues: Dispatch<SetStateAction<string[]>>;
}) {
  const onRemove = (idx: number) => {
    setValues((prev) => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-center">Wooshed</label>

      <div className="flex flex-col gap-1">
        {values.map((value, idx) => (
          <div key={value} className="flex flex-row gap-2">
            <span className="px-2 border border-white/20 w-full rounded-2xl">
              {value}
            </span>
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="rounded-xl border border-white/20 cursor-pointer py-2 px-6 font-extrabold text-2xl text-red-400"
            >
              X
            </button>
          </div>
        ))}

        <input
          onKeyDown={(e) => {
            const input = e.target as HTMLInputElement;
            if (e.key === "Enter") {
              setValues((prev) => {
                const next = [...prev, input.value];
                input.value = "";
                return next;
              });
            }
          }}
          placeholder="Chatter"
          type="text"
          className="px-2 border border-white/20 rounded-2xl"
        />
      </div>
    </div>
  );
}

export type FormGame = { name: string; duration: number };

export function FormGames({ value, setValue }: StatePair<FormGame[]>) {
  const suggests =
    schema.properties.vods.items.properties.games.items.properties.name.enum;

  const optionsId = useId();

  const nameRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);

  const onRemove = (idx: number) => {
    setValue((prev) => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setValue((prev) => {
        if (!nameRef.current || !durationRef.current) return prev;
        if (
          !suggests.includes(nameRef.current.value) ||
          !durationRef.current.valueAsNumber
        )
          return prev;

        const next = [
          ...prev,
          {
            name: nameRef.current.value,
            duration: durationRef.current?.valueAsNumber,
          },
        ];

        nameRef.current.value = "";
        durationRef.current.value = "0";

        return next;
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-center">Games</label>

      <div className="flex flex-col gap-1">
        {value.map(({ name, duration }, idx) => (
          <div key={name + duration} className="flex flex-row gap-2">
            <input
              value={name}
              onChange={({ currentTarget: { value } }) => {
                setValue((prev) => {
                  const next = [...prev];
                  next[idx]!.name = value;
                  return next;
                });
              }}
              required
              className="px-2 border border-white/20 w-full rounded-2xl"
            />
            <input
              value={duration}
              onChange={({ currentTarget: { valueAsNumber } }) => {
                setValue((prev) => {
                  const next = [...prev];
                  next[idx]!.duration = valueAsNumber;
                  return next;
                });
              }}
              type="number"
              required
              className="px-2 border border-white/20 w-full rounded-2xl"
            />
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="rounded-xl border border-white/20 cursor-pointer py-2 px-6 font-extrabold text-2xl text-red-400"
            >
              X
            </button>
          </div>
        ))}

        <div className="flex flex-row gap-2">
          <input
            ref={nameRef}
            onKeyDown={onKeyDown}
            list={optionsId}
            type="text"
            placeholder="Name"
            className="px-2 border border-white/20 rounded-2xl grow"
          />

          <input
            ref={durationRef}
            onKeyDown={onKeyDown}
            type="number"
            placeholder="Duration"
            className="px-2 border border-white/20 min-w-0 rounded-2xl [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
          />
        </div>
      </div>

      <datalist id={optionsId}>
        {suggests.map((suggest) => (
          <option value={suggest} />
        ))}
      </datalist>
    </div>
  );
}

export type FormPromise = {
  name: string;
  outcome: string;
  status: "o" | "x" | "?";
};

export interface FormPromisesProps {
  promises: FormPromise[];
  setPromises: Dispatch<SetStateAction<FormPromise[]>>;
}

export function FormPromises({ promises, setPromises }: FormPromisesProps) {
  const promiseRef = useRef<HTMLInputElement>(null);
  const outcomeRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);

  const onRemove = (idx: number) => {
    setPromises((prev) => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPromises((prev) => {
        if (!promiseRef.current || !outcomeRef.current || !statusRef.current)
          return prev;
        if (
          !promiseRef.current.value ||
          !outcomeRef.current.value ||
          !["o", "x", "?"].includes(statusRef.current.value)
        )
          return prev;

        const next = [
          ...prev,
          {
            name: promiseRef.current.value,
            outcome: outcomeRef.current.value,
            status: statusRef.current.value as FormPromise["status"],
          },
        ];

        promiseRef.current.value = "";
        outcomeRef.current.value = "";
        statusRef.current.value = "";

        return next;
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-center">Promises</label>

      <div className="flex flex-col gap-1">
        {promises.map((p, idx) => (
          <div key={p.name} className="flex flex-row gap-2">
            <input
              value={p.name}
              onChange={({ currentTarget: { value } }) => {
                setPromises((prev) => {
                  const next = [...prev];
                  next[idx]!.name = value;
                  return next;
                });
              }}
              required
              className="px-2 border border-white/20 w-full rounded-2xl"
            />
            <input
              value={p.outcome}
              onChange={({ currentTarget: { value } }) => {
                {
                  setPromises((prev) => {
                    const next = [...prev];
                    next[idx]!.outcome = value;
                    return next;
                  });
                }
              }}
              required
              className="px-2 border border-white/20 w-full rounded-2xl"
            />
            <input
              value={p.status}
              onChange={({ currentTarget: { value } }) => {
                {
                  setPromises((prev) => {
                    const next = [...prev];
                    next[idx]!.status = value as FormPromise["status"];
                    return next;
                  });
                }
              }}
              required
              pattern="[ox?]"
              className="px-2 border border-white/20 w-full rounded-2xl"
            />
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="rounded-xl border border-white/20 cursor-pointer py-2 px-6 font-extrabold text-2xl text-red-400"
            >
              X
            </button>
          </div>
        ))}

        <div className="flex flex-row *:min-w-0 gap-2">
          <input
            ref={promiseRef}
            onKeyDown={onKeyDown}
            type="text"
            placeholder="Name"
            className="px-2 border border-white/20 rounded-2xl"
          />

          <input
            ref={outcomeRef}
            onKeyDown={onKeyDown}
            type="text"
            placeholder="Outcome"
            className="px-2 border border-white/20 rounded-2xl"
          />

          <input
            ref={statusRef}
            onKeyDown={onKeyDown}
            type="text"
            placeholder="Status"
            pattern="[xo?]"
            className="px-2 border border-white/20 rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
