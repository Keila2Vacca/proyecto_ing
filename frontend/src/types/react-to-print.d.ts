
declare module 'react-to-print' {
  import { Ref } from 'react';
  
  interface UseReactToPrintProps {
    contentRef: Ref<HTMLDivElement>;
    documentTitle?: string;
    onBeforeGetContent?: () => void;
    onBeforePrint?: () => void;
    onAfterPrint?: () => void;
    removeAfterPrint?: boolean;
    pageStyle?: string;
  }

  export function useReactToPrint(props: UseReactToPrintProps): () => void;
}