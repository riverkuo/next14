// "use client" // 你不能同時用async component和hooks
// 可以直接對 component 下 async 然後 await //預設都是server components
import React from 'react';
import { RickandmortyCharacterRes } from '../../../typings';
import Link from 'next/link';
import Image from 'next/image';
import CharasList from './CharacterList';

const charasFetcher = async (url: string) => {
  const res = await fetch(url);
  const charasData: RickandmortyCharacterRes = await res.json();
  return charasData;
};

let currPage = `https://rickandmortyapi.com/api/character`;

const Charas = async () => {
  const charasRes = await charasFetcher(currPage);
  //NOTE :first load，因為和client端無互動，應為server components
  //想像成進畫面第一次的useEffect
  //server components中，包住client component[v]
  return (
    <div>
      charas page
      <CharasList listInfo={charasRes} />
    </div>
  );
};

export default Charas;
