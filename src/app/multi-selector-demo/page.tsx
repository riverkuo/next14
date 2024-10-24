import React from 'react';
import MultipleSelector from '@/lib/MultiSelector';
import { DropDownItem } from '@/lib/MultiSelector/types';

const options: DropDownItem[] = [
  { label: 'nextjs', value: 'nextjs' },
  { label: 'React', value: 'react' },
  { label: 'Remix', value: 'remix' },
  { label: 'Vite', value: 'vite' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Ember', value: 'ember', disabled: true },
  { label: 'Gatsby', value: 'gatsby', disabled: true },
  { label: 'Astro', value: 'astro', fixed: true },
];

const MultipleSelectorDemo = () => {
  return (
    <MultipleSelector
      selectFirstItem={false}
      staticOptions={options}
      creatable
      placeholder="Select frameworks you like..."
      emptyIndicator={
        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">no results found.</p>
      }
    />
  );
};

export default MultipleSelectorDemo;
