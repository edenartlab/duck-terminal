import * as React from 'react'

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener('change', onChange)
    setValue(result.matches)

    return () => result.removeEventListener('change', onChange)
  }, [query])

  return value
}

// import * as React from 'react';
//
// export interface UseMediaQueryOptions {
//   defaultMatches?: boolean;
//   matchMedia?: typeof window.matchMedia;
//   noSsr?: boolean;
// }
//
// export function useMediaQuery(
//   query: string,
//   options: UseMediaQueryOptions = {},
// ): boolean {
//   const supportMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined';
//   const {
//     defaultMatches = false,
//     matchMedia = supportMatchMedia ? window.matchMedia : null,
//     noSsr = false
//   } = options;
//
//   const [match, setMatch] = React.useState(() => {
//     if (noSsr && matchMedia) {
//       return matchMedia(query).matches;
//     }
//     return defaultMatches;
//   });
//
//   React.useEffect(() => {
//     if (!matchMedia) {
//       return undefined;
//     }
//
//     const queryList = matchMedia(query);
//     const updateMatch = () => {
//       setMatch(queryList.matches);
//     };
//
//     updateMatch();
//     queryList.addEventListener('change', updateMatch);
//
//     return () => {
//       queryList.removeEventListener('change', updateMatch);
//     };
//   }, [query, matchMedia]);
//
//   return match;
// }
