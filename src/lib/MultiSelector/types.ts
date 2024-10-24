import { Command } from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';

export interface MultipleSelectorProps {
  /** default selected value */
  defaultSelectedValue?: DropDownItem[];

  /** static options */
  staticOptions?: DropDownItem[];

  /** dynamic options */
  options?: DropDownItem[];

  /** placeholder 字串 */
  placeholder?: string;

  /** loading 元件 */
  loadingIndicator?: React.ReactNode;

  /** 無符合相同選項時元件 */
  emptyIndicator?: React.ReactNode;

  /** 搜尋 debounce 秒數, 作用於 `onSearch`. */
  delay?: number;

  /**
   * 與 `onSearch` 作用, `onFocus` 時搜尋
   * 點擊input, 會 trigger搜尋初始的 options
   **/
  triggerSearchOnFocus?: boolean;

  /** 非同步 search */
  onSearch?: (value: string) => Promise<DropDownItem[]>;

  /**
   * 同步 search. 不顯示 loadingIndicator.
   **/
  onSearchSync?: (value: string) => DropDownItem[];

  /** onChange */
  onChange?: (options: DropDownItem[]) => void;

  /** 限制選取的 option數量 */
  maxSelected?: number;

  /** maxSelected時會trigger */
  onMaxSelected?: (maxLimit: number) => void;

  /** 有選項選取時，是否顯示place holder */
  hidePlaceholderWhenSelected?: boolean;

  /** 是否可以選取 */
  disabled?: boolean;

  /** Group the options base on provided key. */
  groupBy?: string;

  className?: string;
  badgeClassName?: string;

  /**
   * cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;

  /** 是否可以自行輸入選項，若為true，不會出現 emptyIndicator */
  creatable?: boolean;

  /** `Command`的 props */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;

  /** `CommandInput`的 props */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >;

  /** 使否隱藏清除按鈕 */
  hideClearAllButton?: boolean;
}

export interface DropDownItem {
  value: string;
  label: string;
  disabled?: boolean;

  /** fixed options 不能被刪除 */
  fixed?: boolean;

  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}

export interface GroupDropDown {
  [key: string]: DropDownItem[];
}

export interface MultipleSelectorRef {
  selectedValue: DropDownItem[];
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}
