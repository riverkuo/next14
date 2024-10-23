import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { GroupOption, MultipleSelectorProps, OptionItem } from './types';
import { useDebounce } from './useDebounce';
import { removePickedOption, transToGroupOption } from './utils';

interface useMultiSelectorProps {
  dropdownRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  arrayDefaultOptions: MultipleSelectorProps['defaultOptions'];
  groupBy: MultipleSelectorProps['groupBy'];

  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;

  setSelected: Dispatch<SetStateAction<OptionItem[]>>;
  selected: OptionItem[];

  onChange: MultipleSelectorProps['onChange'];

  value: MultipleSelectorProps['value'];

  arrayOptions: OptionItem[] | undefined;
  onSearch: MultipleSelectorProps['onSearch'];
  onSearchSync: MultipleSelectorProps['onSearchSync'];
  inputValue: string;
  delay: MultipleSelectorProps['delay'];
  triggerSearchOnFocus: MultipleSelectorProps['triggerSearchOnFocus'];
  creatable: MultipleSelectorProps['creatable'];
  commandProps: MultipleSelectorProps['commandProps'];
}

export function useMultiSelector({
  dropdownRef,
  inputRef,
  arrayDefaultOptions = [],
  groupBy,
  setOpen,
  open,
  setSelected,
  selected,
  onChange,
  value,
  arrayOptions,
  onSearch,
  onSearchSync,
  inputValue,
  delay,
  triggerSearchOnFocus,
  creatable,
  commandProps,
}: useMultiSelectorProps) {
  const [options, setOptions] = useState<GroupOption>(transToGroupOption(arrayDefaultOptions, groupBy));
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(inputValue, delay || 500);
  const selectables = useMemo<GroupOption>(() => removePickedOption(options, selected), [options, selected]);

  const handleUnselect = useCallback(
    (option: OptionItem) => {
      const newOptions = selected.filter((s) => s.value !== option.value);
      setSelected(newOptions);
      onChange?.(newOptions);
    },
    [onChange, selected, setSelected]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '' && selected.length > 0) {
            const lastSelectOption = selected[selected.length - 1];
            // If last item is fixed, we should not remove it.
            if (!lastSelectOption.fixed) {
              handleUnselect(selected[selected.length - 1]);
            }
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    [handleUnselect, inputRef, selected]
  );

  const commandFilter = useCallback(() => {
    if (commandProps?.filter) {
      return commandProps.filter;
    }

    if (creatable) {
      return (value: string, search: string) => {
        return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
      };
    }
    // Using default filter in `cmdk`. We don't have to provide it.
    return undefined;
  }, [creatable, commandProps?.filter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        inputRef.current.blur();
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchend', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, [dropdownRef, inputRef, open, setOpen]);

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [setSelected, value]);

  useEffect(() => {
    /** If `onSearch` is provided, do not trigger options updated. */
    if (!arrayOptions || onSearch) {
      return;
    }
    const newOption = transToGroupOption(arrayOptions || [], groupBy);
    if (JSON.stringify(newOption) !== JSON.stringify(options)) {
      setOptions(newOption);
    }
  }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

  useEffect(() => {
    /** sync search */

    const doSearchSync = () => {
      const res = onSearchSync?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
    };

    const exec = async () => {
      if (!onSearchSync || !open) return;

      if (triggerSearchOnFocus) {
        doSearchSync();
      }

      if (debouncedSearchTerm) {
        doSearchSync();
      }
    };

    void exec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

  /** async search */
  useEffect(() => {
    const doSearch = async () => {
      setIsLoading(true);
      const res = await onSearch?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
      setIsLoading(false);
    };

    const exec = async () => {
      if (!onSearch || !open) return;

      if (triggerSearchOnFocus) {
        await doSearch();
      }

      if (debouncedSearchTerm) {
        await doSearch();
      }
    };

    void exec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

  return { options, debouncedSearchTerm, isLoading, handleKeyDown, commandFilter, handleUnselect, selectables };
}
