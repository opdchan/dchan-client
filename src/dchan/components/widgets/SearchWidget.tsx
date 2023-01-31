import { useCallback, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { debounce } from "lodash";
import { Router } from "router";

export const SearchWidget = ({
  search = "",
  open = true
}: {
  baseUrl: string;
  search?: string;
  open?: boolean
}) => {
  const history = useHistory();
  const [displayInput, setDisplayInput] = useState<string>(search || "");
  const setSearch = useCallback(
    (search: string) => {
      history.push(Router.posts({search}));
      setDisplayInput(search)
    },
    [history, setDisplayInput]
  );

  const inputRef = useRef(null)

  const resetSearch = useCallback(() => {
    setSearch("");
    if(!!inputRef?.current) {
      (inputRef as any).current.value = ""
    }
  }, [setSearch]);

  const setSearchDebounce = useMemo(
    () => debounce(setSearch, 500),
    [setSearch]
  );

  const onChange = useCallback(
    (e: any) => {
      const search = e.target.value
      setDisplayInput(search);
      setSearchDebounce(search);
    },
    [setSearchDebounce]
  );

  return (
    <details className="grid center self-center bg-secondary border border-secondary-accent p-1" open={open}>
      <summary>Search</summary>
      <div>
        <input
          id={`dchan-search`}
          className="text-center w-32"
          ref={inputRef}
          type="text"
          placeholder="..."
          value={displayInput}
          onChange={onChange}
          autoFocus={true}
        ></input>
      </div>
      <div className="relative">
        {search ? (
          <span className="text-xs">
            [
            <button className="dchan-link" onClick={resetSearch}>
              Cancel
            </button>
            ]
          </span>
        ) : (
          ""
        )}
      </div>
    </details>
  );
}
