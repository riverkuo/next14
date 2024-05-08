// "use client" // 你不能同時用async component和hooks
// 可以直接對 component 下 async 然後 await //預設都是server components
import React from 'react';
import { RickandmortyCharacterRes } from '../../../typings';
import Link from 'next/link';
import Image from 'next/image';

const charasFetcher = async (url: string) => {
  const res = await fetch(url);
  const charasData: RickandmortyCharacterRes = await res.json();
  return charasData;
};

let currPage = `https://rickandmortyapi.com/api/character`;

const Charas = async () => {
  const { info, results } = await charasFetcher(currPage);

  return (
    <div>
      charas page
      {results?.map((char) => (
        <div className="flex items-center w-full my-2 p-4 shadow-xl rounded-lg" key={char.id}>
          <div className="">
            <Image src={char.image} alt={char.name} width={100} height={100} />
          </div>
          <div>
            <p>{char.name}</p>
            <Link href={`/characters/${char.id}`}>{char.id}</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Charas;
