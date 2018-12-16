import React, { useEffect, useReducer, useRef } from "react";

const fetchItems = (method = "GET", body?: any) => {
  return fetch("http://localhost:4567/items.json", {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(res => res.json());
};

function App() {
  const [state, setState]: [any, any] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { items: [], loading: true, todoItem: "", offline: !navigator.onLine },
  );

  // FIX: Toggling the Offline button doesn't re-render the app
  useEffect(
    () => {
      setState({ loading: true });
      fetchItems().then(items => setState({ items, loading: false }));

      function setOfflineStatus() {
        setState({ offline: !navigator.onLine });
      }

      window.addEventListener("online", () => setOfflineStatus);
      window.addEventListener("offline", () => setOfflineStatus);

      return function cleanup() {
        window.removeEventListener("online", () => setOfflineStatus);
        window.removeEventListener("offline", () => setOfflineStatus);
      };
    },
    [state.offline],
  );

  return (
    <div className="App">
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">
          <img src={require("./logo.svg")} className="App-logo" alt="logo" />
          Todo List
        </span>
        {state.offline && (
          <span className="badge badge-danger my-3">Offline</span>
        )}
      </nav>

      <div className="px-3 py-2">
        <form
          className="form-inline my-3"
          onSubmit={e => {
            e.preventDefault();
            fetchItems("POST", {
              item: state.todoItem,
            }).then(items => setState({ items, todoItem: "" }));
          }}
        >
          <div className="form-group mb-2 p-0 pr-3 col-8 col-sm-10">
            <input
              className="form-control col-12"
              placeholder="What do you need to do?"
              value={state.todoItem}
              onChange={e => setState({ todoItem: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary mb-2 col-4 col-sm-2">
            Add
          </button>
        </form>

        {state.loading && <p>Loading...</p>}

        {!state.loading && state.items.length === 0 && (
          <div className="alert alert-secondary">No items - all done!</div>
        )}

        {!state.loading && state.items && (
          <table className="table table-striped">
            <tbody>
              {state.items.map(
                (item: { id: number; item: string }, index: number) => {
                  return (
                    <tr key={item.id} className="row">
                      <td className="col-1">{index + 1}</td>
                      <td className="col-10">{item.item}</td>
                      <td className="col-1">
                        <button
                          type="button"
                          className="close"
                          aria-label="Close"
                          onClick={e => {
                            e.preventDefault();
                            fetchItems("DELETE", {
                              id: item.id,
                            }).then(items => setState({ items }));
                          }}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
