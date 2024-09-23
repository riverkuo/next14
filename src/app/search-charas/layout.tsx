import React from 'react';
import { Search } from './search-input';

const SearchCharasLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex space-x-4 divide-x-2 p-5">
      <div>
        <h1>Search Characters</h1>
        <Search />
        {/* NOTE: 把search包在layout裡，就不會因路由改變而重新渲染 */}
      </div>
      <div className="flex-1 pl-5">
        <div>{children}</div>
      </div>
    </main>
  );
};

export default SearchCharasLayout;
