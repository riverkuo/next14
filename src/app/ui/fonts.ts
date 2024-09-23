import { Inter, Lusitana } from 'next/font/google'; //river:note //inter is a font //subset is 字體（）
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const lusitana = Lusitana({
  subsets: ['latin'],
  weight: ['400', '700'],
});
