import { useEffect, useState, type SubmitEventHandler } from "react";
import { getVideo } from "./lib";
import { HeaderData } from "./components/HeaderData";
import {
  FormCategories,
  FormCollabs,
  FormDate,
  FormDivider,
  FormGames,
  FormGssCounter,
  FormGssCreators,
  FormHats,
  FormNotablePeople,
  FormPlaidShirtCounter,
  FormPromises,
  FormSubmit,
  FormWooshed,
  FormYokCounter,
  type FormPromise,
  type FormGame,
  FormPerAtrioc,
} from "./components/Form";
import { useRef } from "#imports";

export function App() {
  const searchParams = new URLSearchParams(window.location.search);

  const id = searchParams.get("v")!;
  const [duration, setDuration] = useState(0);
  const title = document
    .querySelector("h1.ytd-watch-metadata")
    ?.textContent!.trim();
  const date = useRef("");
  const [hats, setHats] = useState<string[]>([]);
  const [yok, setYok] = useState(0);
  const [plaidShirt, setPlaidShirt] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [notablePeople, setNotablePeople] = useState<string[]>([]);
  const [gss, setGss] = useState(0);
  const [gssCreators, setGssCreators] = useState<string[]>([]);
  const [perAtrioc, setPerAtrioc] = useState<string[]>([]);
  const [wooshed, setWooshed] = useState<string[]>([]);
  const [games, setGames] = useState<FormGame[]>([]);
  const [collabs, setCollabs] = useState<string[]>([]);
  const [promises, setPromises] = useState<FormPromise[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    getVideo(controller.signal)
      .then((video) => {
        console.log("[atrioc-recap-tracker] video found");
        setDuration(Math.round(video.duration));
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const obj = {
      id,
      title,
      date: date.current,
      duration,
      hats,
      yok,
      plaidShirt,
      categories,
      notablePeople,
      gss,
      gssCreators,
      perAtrioc,
      wooshed,
      games,
      collabs,
      promises,
    };

    const str = JSON.stringify(obj, undefined, 2);
    await navigator.clipboard.writeText(str);
  };

  return (
    <div
      onKeyDown={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation?.();
      }}
      onKeyUp={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation?.();
      }}
      className="border border-white/20 rounded-xl p-4 mb-4 mx-2 max-h-310 overflow-y-auto [&::-webkit-scrollbar]:hidden"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        <div className="text-center text-2xl">Atrioc Recap Writer</div>

        <FormSubmit />

        <HeaderData vidId={id} duration={duration} />

        <div className="mx-auto">
          <FormDate onInput={(e) => (date.current = e.currentTarget.value)} />
        </div>

        <FormDivider />

        <div className="flex flex-row justify-stretch  gap-2">
          <FormCategories setSelected={setCategories} />
          <FormHats setSelected={setHats} />
        </div>

        <FormDivider />

        <div className="flex flex-row justify-evenly gap-2">
          <FormYokCounter value={yok} setValue={setYok} />
          <FormPlaidShirtCounter value={plaidShirt} setValue={setPlaidShirt} />
        </div>

        <FormDivider />

        <FormNotablePeople
          values={notablePeople}
          setValues={setNotablePeople}
        />

        <FormDivider />

        <div className="mx-auto">
          <FormGssCounter value={gss} setValue={setGss} />
        </div>

        <FormGssCreators values={gssCreators} setValues={setGssCreators} />

        <FormPerAtrioc values={perAtrioc} setValues={setPerAtrioc} />

        <FormWooshed values={wooshed} setValues={setWooshed} />

        <FormGames value={games} setValue={setGames} />

        <FormCollabs values={collabs} setValues={setCollabs} />

        <FormPromises promises={promises} setPromises={setPromises} />
      </form>
    </div>
  );
}
